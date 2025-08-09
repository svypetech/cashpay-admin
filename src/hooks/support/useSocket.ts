"use client";

import { useToast } from '@/src/lib/ToastProvider';
import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || '';

export const useSocket = (ticketId?: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const recentlySentRef = useRef<boolean>(false);
    const { showSuccess, showError } = useToast();
    
    useEffect(() => {

        console.log("Connecting to support socket at:", SOCKET_URL);

        const socket = io(SOCKET_URL, {
            // path: "/help/socket.io/",
            auth: {
                token: localStorage.getItem("token")
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            secure: true, 
        });
        
        socketRef.current = socket;
        
        socket.on('connect', () => {
            setIsConnected(true);
            
            // Emit joinTicket event once connected
            if (ticketId) {
                // showSuccess("Connected", "Successfully connected to the support server");
                socket.emit('joinTicket', {'ticketId':ticketId});
                console.log(`Joined ticket: ${ticketId}`);
            }
        });
        
        socket.on('disconnect', () => {
            setIsConnected(false);
        });
        
        socket.on('connect_error', (error) => {
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
    }, [showError, ticketId]);
    
    // 📤 SEND MESSAGE (Text only)
    const sendMessage = useCallback((message: string, ticketId: string) => {
        if (!socketRef.current || !isConnected) {
            return Promise.resolve({ success: false, tempId: null });
        }
        
        return new Promise<{ success: boolean, tempId: string | null }>((resolve) => {
            try {
                const tempId = `temp-${Date.now()}`;
                
                recentlySentRef.current = true;
                
                socketRef.current!.emit('message', {
                    message,
                    ticketId,
                    authorization: `Bearer ${localStorage.getItem("token")}`
                });
                
                setTimeout(() => {
                    recentlySentRef.current = false;
                }, 10000);
                
                resolve({ success: true, tempId });
            } catch (error) {
                resolve({ success: false, tempId: null });
            }
        });
    }, [isConnected]);

    // 📎 SEND FILE with optional message
    const sendFile = useCallback((file: File, message: string, ticketId: string) => {
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

                    // First argument: file metadata + message + ticketId
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
                        ticketId: ticketId
                    };

                    recentlySentRef.current = true;
                    
                    // Emit with both arguments - send actual buffer
                    socketRef.current!.emit('handleFile', fileMetadata, buffer);
                    
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

    // 📤 JOIN TICKET (Manual join if needed)
    const joinTicket = useCallback((ticketId: string) => {
        if (!socketRef.current || !isConnected) {
            return false;
        }
        
        try {
            socketRef.current.emit('joinTicket', ticketId);
            return true;
        } catch (error) {
            return false;
        }
    }, [isConnected]);
    
    // 📨 LISTEN FOR NEW MESSAGES
    const onNewMessage = useCallback((callback: (messages: any[], isRefetch: boolean) => void) => {
        if (!socketRef.current) return () => {};
        
        socketRef.current.on('ticketChat', (...args) => {
            // Handle the server response format you provided
            const serverResponse = args[0];
            
            if (serverResponse && serverResponse.success && serverResponse.data && serverResponse.data.chats) {
                // This is the server confirmation response with chats array
                const chats = serverResponse.data.chats;
                if (chats.length > 0) {
                    // Check if this is a new message or a refetch
                    // If recentlySentRef is true, this might be our own message confirmation
                    if (recentlySentRef.current) {
                        // This is likely our own message confirmation
                        const latestMessage = chats[0];
                        callback([latestMessage], false);
                    } else {
                        // This might be messages from others or initial load
                        // Process all new messages that we haven't seen
                        callback(chats, true); // Mark as refetch to handle properly in Chat component
                    }
                }
            } else {
                // Handle direct message format (single message)
                const latestMessage = args[args.length - 1];
                
                if (latestMessage && latestMessage._id && (latestMessage.message || latestMessage.image)) {
                    callback([latestMessage], false);
                } else {
                    // Fallback: look for any valid message in args
                    const validMessage = args.find(arg => 
                        arg && arg._id && (arg.message || arg.image) && arg.ticketId
                    );
                    
                    if (validMessage) {
                        callback([validMessage], false);
                    }
                }
            }
        });
        
        // Listen for direct message events (for real-time messages from others)
        socketRef.current.on('message', (messageData) => {
            if (messageData && messageData._id) {
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
            socketRef.current?.off('ticketChat');
            socketRef.current?.off('message');
            socketRef.current?.off('fileUploaded');
            socketRef.current?.off('newMessage');
            socketRef.current?.off('newFileMessage');
        };
    }, []);
    
    return { 
        socket: socketRef.current, 
        sendMessage,
        sendFile,
        joinTicket,
        onNewMessage,
        isConnected 
    };
};