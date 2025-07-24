"use client";

import { useToast } from '@/src/lib/ToastProvider';
import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

// const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "";
const SOCKET_URL = 'https://34.75.109.160:3002';

export const useP2PSocket = () => {
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
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      setIsConnected(false);
      // showError("Connection Error", `Failed to connect to server: ${error.message}`);
    });

    // Listen for general socket errors
    socket.on('error', (error) => {
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
      socket.disconnect();
    };
  }, [showError]);

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

            // Set recently sent flag
            recentlySentRef.current = true;

            socketRef.current!.emit("p2pMessage", {
              message,
              orderId,
              authorization: `Bearer ${localStorage.getItem("token")}`,
            });

            // Reset flag after 10 seconds
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
        
        // Convert file to ArrayBuffer using FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            showError("Upload Error", "Failed to read file");
            resolve({ success: false, tempId: null });
            return;
          }

          // Convert ArrayBuffer to Buffer (Node.js style buffer that Socket.IO can handle)
          const buffer = Buffer.from(arrayBuffer);

          // First argument: file metadata + message + orderId
          const fileMetadata = {
            image: {
              fieldname: "file",
              originalname: file.name,
              encoding: "7bit",
              mimetype: file.type,
              size: file.size
            },
            // Send message in the same format as server expects
            message: message.trim() ? message.trim() : file.name,
            orderId: orderId
          };

          recentlySentRef.current = true;
          
          // Use the correct event name for P2P file upload
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
        
        // Read file as ArrayBuffer to get binary data
        reader.readAsArrayBuffer(file);
      } catch (error) {
        showError("Upload Error", "Failed to send file");
        resolve({ success: false, tempId: null });
      }
    });
  }, [isConnected, showError]);

  // 📨 LISTEN FOR NEW MESSAGES
  const onNewMessage = useCallback(
    (callback: (messages: any[], isRefetch: boolean) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("p2pChat", (...args) => {
        // The server response structure has: success, last10Chats, newChat
        const response = args[0]; // First argument should be the response object

        if (response && response.success) {
          // Use the newChat for real-time updates
          if (
            response.newChat &&
            response.newChat._id &&
            (response.newChat.message || response.newChat.image)
          ) {
            callback([response.newChat], false);
          }

          // Also handle last10Chats if needed for refetch
          if (
            response.last10Chats &&
            response.last10Chats.chats &&
            response.last10Chats.chats.length > 0
          ) {
            callback(response.last10Chats.chats, true);
          }
        } else {
          // Fallback to previous logic
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

      // Listen for file upload success responses
      socketRef.current.on('fileUploaded', (fileData) => {
        if (fileData && fileData._id) {
          callback([fileData], false);
        }
      });

      // Listen for new incoming messages from other users
      socketRef.current.on('newMessage', (messageData) => {
        if (messageData && messageData._id) {
          callback([messageData], false);
        }
      });

      // Listen for new file messages from other users
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
    onNewMessage,
    isConnected,
  };
};