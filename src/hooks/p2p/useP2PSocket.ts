"use client";

import { useToast } from '@/src/lib/ToastProvider';
import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || '';

export const useP2PSocket = (orderId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const recentlySentRef = useRef<boolean>(false);
  const { showError } = useToast();

  useEffect(() => {
    console.log("Connecting to P2P socket at:", SOCKET_URL);

    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      secure: true, // means use HTTPS
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log('✅ P2P Socket connected successfully');
      setIsConnected(true);
      
      // Emit joinOrder event once connected (similar to joinTicket in regular chat)
      if (orderId) {
        socket.emit('joinOrder', orderId);
        console.log('📡 Joined order room:', orderId);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log('❌ P2P Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error('🔥 P2P Socket connection error:', error);
      setIsConnected(false);
    });

    // Listen for general socket errors
    socket.on('error', (error) => {
      console.error('🔥 P2P Socket error:', error);
      showError("Socket Error", error.message || "An unexpected error occurred");
    });

    // Listen for file upload errors
    socket.on('fileUploadError', (error) => {
      showError("File Upload Failed", error.message || "Failed to upload file");
    });

    // Listen for message send errors
    socket.on('messageError', (error) => {
      showError("Message Send Failed", error.message || "Failed to send message");
    });

    // Listen for authentication errors
    socket.on('authError', (error) => {
      showError("Authentication Error", error.message || "Authentication failed");
    });

    // Listen for general server errors
    socket.on('serverError', (error) => {
      showError("Server Error", error.message || "Server error occurred");
    });

    return () => {
      console.log('🔌 Disconnecting P2P socket...');
      socket.disconnect();
    };
  }, [showError, orderId]);

  // 📤 SEND MESSAGE (Text only)
  const sendMessage = useCallback(
    (message: string, orderId: string) => {
      if (!socketRef.current || !isConnected) {
        return Promise.resolve({ success: false, tempId: null });
      }

      return new Promise<{ success: boolean; tempId: string | null }>(
        (resolve) => {
          try {
            const tempId = `temp-${Date.now()}`;

            recentlySentRef.current = true;

            socketRef.current!.emit("p2pMessage", {
              message,
              orderId,
              authorization: `Bearer ${localStorage.getItem("token")}`,
            });

            setTimeout(() => {
              recentlySentRef.current = false;
            }, 10000);

            resolve({ success: true, tempId });
          } catch (error) {
            resolve({ success: false, tempId: null });
          }
        }
      );
    },
    [isConnected]
  );

  // 📎 SEND FILE with optional message
  const sendFile = useCallback((file: File, message: string, orderId: string) => {
    if (!socketRef.current || !isConnected) {
      showError("Connection Error", "Unable to send file. Please check your connection.");
      return Promise.resolve({ success: false, tempId: null });
    }
    
    return new Promise<{ success: boolean, tempId: string | null }>((resolve) => {
      try {
        const tempId = `temp-${Date.now()}`;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            showError("Upload Error", "Failed to read file");
            resolve({ success: false, tempId: null });
            return;
          }

          const buffer = Buffer.from(arrayBuffer);

          const fileMetadata = {
            image: {
              fieldname: "file",
              originalname: file.name,
              encoding: "7bit",
              mimetype: file.type,
              size: file.size
            },
            message: message.trim() ? message.trim() : file.name,
            orderId: orderId
          };

          recentlySentRef.current = true;
          
          socketRef.current!.emit('p2pImage', fileMetadata, buffer);
          
          setTimeout(() => {
            recentlySentRef.current = false;
          }, 10000);
          
          resolve({ success: true, tempId });
        };
        
        reader.onerror = () => {
          showError("Upload Error", "Failed to read file");
          resolve({ success: false, tempId: null });
        };
        
        reader.readAsArrayBuffer(file);
      } catch (error) {
        showError("Upload Error", "Failed to send file");
        resolve({ success: false, tempId: null });
      }
    });
  }, [isConnected, showError]);

  // 📤 JOIN ORDER (Manual join if needed)
  const joinOrder = useCallback((orderId: string) => {
    if (!socketRef.current || !isConnected) {
      return false;
    }
    
    try {
      socketRef.current.emit('joinOrder', orderId);
      return true;
    } catch (error) {
      return false;
    }
  }, [isConnected]);

  // 📨 LISTEN FOR NEW MESSAGES
  const onNewMessage = useCallback(
    (callback: (messages: any[], isRefetch: boolean) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("p2pChat", (...args) => {
        const response = args[0];

        if (response && response.success) {
          if (
            response.newChat &&
            response.newChat._id &&
            (response.newChat.message || response.newChat.image)
          ) {
            callback([response.newChat], false);
          }

          if (
            response.last10Chats &&
            response.last10Chats.chats &&
            response.last10Chats.chats.length > 0
          ) {
            callback(response.last10Chats.chats, true);
          }
        } else {
          const latestMessage = args[args.length - 1];
          if (latestMessage && latestMessage._id && (latestMessage.message || latestMessage.image)) {
            callback([latestMessage], false);
          }
        }
      });

      socketRef.current.on("p2pMessage", (messageData) => {
        if (messageData) {
          callback([messageData], false);
        }
      });

      socketRef.current.on('fileUploaded', (fileData) => {
        if (fileData && fileData._id) {
          callback([fileData], false);
        }
      });

      socketRef.current.on('newMessage', (messageData) => {
        if (messageData && messageData._id) {
          callback([messageData], false);
        }
      });

      socketRef.current.on('newFileMessage', (fileData) => {
        if (fileData && fileData._id) {
          callback([fileData], false);
        }
      });

      return () => {
        socketRef.current?.off("p2pChat");
        socketRef.current?.off("p2pMessage");
        socketRef.current?.off('fileUploaded');
        socketRef.current?.off('newMessage');
        socketRef.current?.off('newFileMessage');
      };
    },
    []
  );

  return {
    socket: socketRef.current,
    sendMessage,
    sendFile,
    joinOrder,
    onNewMessage,
    isConnected,
  };
};