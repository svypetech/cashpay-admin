"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || '';

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const recentlySentRef = useRef<boolean>(false);
    
    useEffect(() => {
        const socket = io(SOCKET_URL, {
            auth: {
                token: localStorage.getItem("token")
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        
        socketRef.current = socket;
        
        socket.on('connect', () => {
            console.log('🔌 Socket.IO Connected');
            setIsConnected(true);
        });
        
        socket.on('disconnect', () => {
            console.log('🔌 Socket.IO Disconnected');
            setIsConnected(false);
        });
        
        socket.on('connect_error', (error) => {
            console.error('🔌 Socket.IO Connection Error:', error);
            setIsConnected(false);
        });
        
        return () => {
            socket.disconnect();
        };
    }, []);
    
    // 📤 SEND MESSAGE
    const sendMessage = useCallback((message: string, ticketId: string) => {
        if (!socketRef.current || !isConnected) {
            console.error("❌ Socket not connected");
            return Promise.resolve({ success: false, tempId: null });
        }
        
        return new Promise<{ success: boolean, tempId: string | null }>((resolve) => {
            try {
                const tempId = `temp-${Date.now()}`;
                
                console.log(`📤 Sending message: "${message}" with tempId: ${tempId}`);
                
                // Set recently sent flag
                recentlySentRef.current = true;
                
                socketRef.current!.emit('message', {
                    message,
                    ticketId,
                    authorization: `Bearer ${localStorage.getItem("token")}`
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
        });
    }, [isConnected]);
    
    // 📨 LISTEN FOR NEW MESSAGES
    const onNewMessage = useCallback((callback: (messages: any[], isRefetch: boolean) => void) => {
        if (!socketRef.current) return () => {};
        
        socketRef.current.on('ticketChat', (...args) => {
            console.log(`🔌 Received ticketChat with ${args.length} arguments:`, args);
            
            // The structure is: ['ticketChat', dataObject, latestMessageObject]
            // We want the last argument which is the latest message
            const latestMessage = args[args.length - 1];
            
            if (latestMessage && latestMessage._id && latestMessage.message) {
                console.log(`🔌 Using latest message: ${latestMessage._id} - "${latestMessage.message}"`);
                callback([latestMessage], false);
            } else {
                // Fallback to the data object
                const data = args.find(arg => arg && arg.success && arg.data);
                if (data && data.data.chats && data.data.chats.length > 0) {
                    const newestMessage = data.data.chats[0];
                    console.log(`🔌 Fallback to newest from chats: ${newestMessage._id} - "${newestMessage.message}"`);
                    callback([newestMessage], false);
                }
            }
        });
        
        socketRef.current.on('message', (messageData) => {
            if (messageData) {
                console.log('🔌 Received direct message:', messageData._id);
                callback([messageData], false);
            }
        });
        
        return () => {
            socketRef.current?.off('ticketChat');
            socketRef.current?.off('message');
        };
    }, []);
    
    return { 
        socket: socketRef.current, 
        sendMessage,
        onNewMessage,
        isConnected 
    };
};