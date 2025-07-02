"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "";

export const useP2PSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const recentlySentRef = useRef<boolean>(false);

  useEffect(() => {
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
      console.log("🔌 Socket.IO Connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket.IO Disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("🔌 Socket.IO Connection Error:", error);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 📤 SEND MESSAGE
  const sendMessage = useCallback(
    (message: string, orderId: string) => {
      if (!socketRef.current || !isConnected) {
        console.error("❌ Socket not connected");
        return Promise.resolve({ success: false, tempId: null });
      }

      return new Promise<{ success: boolean; tempId: string | null }>(
        (resolve) => {
          try {
            const tempId = `temp-${Date.now()}`;

            console.log(
              `📤 Sending message: "${message}" with tempId: ${tempId}`
            );

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
            console.error("❌ Error emitting message:", error);
            resolve({ success: false, tempId: null });
          }
        }
      );
    },
    [isConnected]
  );

  // 📨 LISTEN FOR NEW MESSAGES
  const onNewMessage = useCallback(
    (callback: (messages: any[], isRefetch: boolean) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("p2pChat", (...args) => {
        console.log(
          `🔌 Received p2pChat with ${args.length} arguments:`,
          args
        );

        // The server response structure has: success, last10Chats, newChat
        const response = args[0]; // First argument should be the response object

        if (response && response.success) {
          // Use the newChat for real-time updates
          if (
            response.newChat &&
            response.newChat._id &&
            response.newChat.message
          ) {
            console.log(
              `🔌 Processing newChat: ${response.newChat._id} - "${response.newChat.message}"`
            );
            callback([response.newChat], false);
          }

          // Also handle last10Chats if needed for refetch
          if (
            response.last10Chats &&
            response.last10Chats.chats &&
            response.last10Chats.chats.length > 0
          ) {
            console.log(
              `🔌 Processing last10Chats: ${response.last10Chats.chats.length} messages`
            );
            callback(response.last10Chats.chats, true);
          }
        } else {
          // Fallback to previous logic
          const latestMessage = args[args.length - 1];
          if (latestMessage && latestMessage._id && latestMessage.message) {
            console.log(
              `🔌 Fallback - Using latest message: ${latestMessage._id} - "${latestMessage.message}"`
            );
            callback([latestMessage], false);
          }
        }
      });

      socketRef.current.on("p2pMessage", (messageData) => {
        if (messageData) {
          console.log("🔌 Received direct message:", messageData._id);
          callback([messageData], false);
        }
      });

      return () => {
        socketRef.current?.off("p2pChat");
        socketRef.current?.off("p2pMessage");
      };
    },
    []
  );

  return {
    socket: socketRef.current,
    sendMessage,
    onNewMessage,
    isConnected,
  };
};