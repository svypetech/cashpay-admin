"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import MessageListSkeleton from "@/src/components/skeletons/MessageListSkeleton";
import ChatHeaderSkeleton from "@/src/components/skeletons/ChatHeaderSkeleton";
import { ChatUser, P2PMessage } from "@/src/Types/chat";
import { useP2PSocket } from "@/src/hooks/p2p/useP2PSocket";
import ChatHeader from "../CustomerSupport/ChatHeader";
import P2PMessageList from "./P2PMessageList";
import ChatInput from "../CustomerSupport/ChatInput";

interface ChatProps {
  chatId: string;
  user: ChatUser;
  initialMessages?: P2PMessage[];
  onClose?: () => void;
  showHeader?: boolean;
  className?: string;
  isLoading?: boolean;
  isError?: string | null;
  loadMoreMessages?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

export default function P2PChat({
  chatId,
  user,
  initialMessages = [],
  onClose,
  showHeader = true,
  className,
  isLoading,
  isError,
  loadMoreMessages = () => {},
  isLoadingMore = false,
  hasMore = false,
}: ChatProps) {
  // Pass chatId as orderId to useP2PSocket (similar to how Chat passes ticketId to useSocket)
  const { sendMessage, sendFile, onNewMessage, isConnected } = useP2PSocket(chatId);
  
  // ✨ DUAL ARRAY SYSTEM
  const [apiMessages, setApiMessages] = useState<P2PMessage[]>(initialMessages); // From API/infinite scroll
  const [socketMessages, setSocketMessages] = useState<P2PMessage[]>([]); // From real-time socket
  const [tempMessages, setTempMessages] = useState<Map<string, P2PMessage>>(new Map()); // Temporary loading states
  
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const socketConnectionTime = useRef<number>(Date.now());

  // 🔄 COMBINED MESSAGES FOR DISPLAY
  const allMessages = useCallback(() => {
    // Combine API messages + socket messages, remove duplicates, sort by date
    const combined = [...apiMessages, ...socketMessages];
    
    // Remove duplicates by ID (socket messages take precedence over API messages)
    const uniqueMessages = combined.reduce((acc, current) => {
      const existing = acc.find(msg => msg._id === current._id);
      if (!existing) {
        acc.push(current);
      } else if (current._id.startsWith('temp-') && !existing._id.startsWith('temp-')) {
        // Replace temp with real message
        const index = acc.findIndex(msg => msg._id === existing._id);
        acc[index] = existing; // Keep the real message
      }
      return acc;
    }, [] as P2PMessage[]);
    
    // Sort by date
    return uniqueMessages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [apiMessages, socketMessages]);

  // 📨 HANDLE NEW MESSAGES FROM SOCKET
  useEffect(() => {
    const cleanupListener = onNewMessage((newMessages, isRefetch) => {
      if (isRefetch) {
        // Full refetch - add to API messages
        setApiMessages(prev => {
          const existingIds = new Set([...prev.map(m => m._id), ...socketMessages.map(m => m._id)]);
          const trulyNewMessages = newMessages.filter(msg => !existingIds.has(msg._id));
          
          if (trulyNewMessages.length > 0) {
            return [...prev, ...trulyNewMessages];
          }
          return prev;
        });
      } else {
        // Single new message
        const newMessage = newMessages[0];
        
        if (newMessage && newMessage.orderId === chatId) {
          // Get current user ID for matching
          const userInfo = localStorage.getItem("user");
          const currentUserId = userInfo ? JSON.parse(userInfo)._id : null;
          
          // Only process messages from current user (our sent messages)
          if (newMessage.sender === currentUserId) {
            // Better matching logic for temp message replacement
            let tempIdToReplace = '';
            
            tempMessages.forEach((tempMsg, tempId) => {
              // For file uploads with temp file info
              if ((tempMsg as any).tempFileInfo && newMessage.image) {
                const tempFileInfo = (tempMsg as any).tempFileInfo;
                const tempFileName = tempFileInfo.name;
                
                // Server message format: "filename\n[user_message]"
                const serverMessage = newMessage.message || '';
                const serverFileName = serverMessage.split('\n')[0]; // Get filename part
                
                // Match by exact filename
                if (tempFileName === serverFileName) {
                  tempIdToReplace = tempId;
                  return;
                }
              }
              // For text messages, match by content and timing (within 30 seconds)
              else if (!newMessage.image && tempMsg.message === newMessage.message) {
                const timeDiff = new Date(newMessage.date).getTime() - new Date(tempMsg.date).getTime();
                if (Math.abs(timeDiff) < 30000) { // Within 30 seconds
                  tempIdToReplace = tempId;
                  return;
                }
              }
            });
            
            if (tempIdToReplace) {
              // Remove from temp messages
              setTempMessages(prev => {
                const updated = new Map(prev);
                updated.delete(tempIdToReplace);
                return updated;
              });
              
              // Replace in socket messages
              setSocketMessages(prev => 
                prev.map(msg => msg._id === tempIdToReplace ? newMessage : msg)
              );
            } else {
              // Add as new message if no temp message to replace
              setSocketMessages(prev => {
                const exists = prev.some(msg => msg._id === newMessage._id);
                if (!exists) {
                  return [...prev, newMessage];
                }
                return prev;
              });
            }
          } else {
            // Message from other user - just add it
            setSocketMessages(prev => {
              const exists = prev.some(msg => msg._id === newMessage._id);
              if (!exists) {
                return [...prev, newMessage];
              }
              return prev;
            });
          }
        }
      }
    });
    
    return cleanupListener;
  }, [chatId, onNewMessage, socketMessages, tempMessages]);

  // 📤 HANDLE SENDING MESSAGES (with optional file)
  const handleSendMessage = async (text: string, file?: File) => {
    if (!text.trim() && !file) return;
    
    const userInfo = localStorage.getItem("user");
    const currentUserId = userInfo ? JSON.parse(userInfo)._id : null;
    
    if (file) {
      // Handle file upload
      setUploadingFile(true);
      try {
        const { success, tempId } = await sendFile(file, text, chatId);
        
        if (success && tempId) {
          // Create temp message that matches the final format
          const isImage = file.type.startsWith('image/');
          const tempImageUrl = isImage ? URL.createObjectURL(file) : undefined;
          
          const tempMessage: P2PMessage = {
            _id: tempId,
            message: text.trim() || `📎 ${file.name}`, // Match the file message format
            isRead: false,
            isReplied: false,
            senderType: "support agent",
            orderId: chatId,
            date: new Date().toISOString(),
            sender: currentUserId || "agent",
            __v: 0,
            image: tempImageUrl,
            // Add temp file info for consistent display
            tempFileInfo: {
              name: file.name,
              size: file.size,
              type: file.type,
              isUploading: true
            }
          };
          
          setTempMessages(prev => new Map(prev).set(tempId, tempMessage));
          setSocketMessages(prev => [...prev, tempMessage]);
        } else {
          console.error("File upload failed");
        }
      } catch (error) {
        console.error("Upload Error:", error);
      } finally {
        setUploadingFile(false);
      }
    } else {
      // Handle text message
      setSendingMessage(true);
      try {
        const { success, tempId } = await sendMessage(text, chatId);
        
        if (success && tempId) {
          const tempMessage: P2PMessage = {
            _id: tempId,
            message: text,
            isRead: false,
            isReplied: false,
            senderType: "support agent",
            orderId: chatId,
            date: new Date().toISOString(),
            sender: currentUserId || "agent",
            __v: 0,
          };
          
          setTempMessages(prev => new Map(prev).set(tempId, tempMessage));
          setSocketMessages(prev => [...prev, tempMessage]);
        } else {
          console.error("Message send failed");
        }
      } catch (error) {
        console.error("Send Error:", error);
      } finally {
        setSendingMessage(false);
      }
    }
  };

  // 🔄 RESET WHEN CHAT CHANGES
  useEffect(() => {
    setApiMessages(initialMessages);
    setSocketMessages([]);
    setTempMessages(new Map());
    socketConnectionTime.current = Date.now();
  }, [chatId]);

  // 🔄 UPDATE API MESSAGES WHEN INITIAL MESSAGES CHANGE (from infinite scroll)
  useEffect(() => {
    setApiMessages(initialMessages);
  }, [initialMessages]);

  // 🕒 CLEANUP TEMP MESSAGES AFTER TIMEOUT
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Cleanup temp messages older than 30 seconds
      setTempMessages(prev => {
        const updated = new Map(prev);
        let hasChanges = false;
        
        for (const [tempId, tempMsg] of updated.entries()) {
          const age = now - new Date(tempMsg.date).getTime();
          if (age > 30000) { // Remove temp messages older than 30 seconds
            updated.delete(tempId);
            hasChanges = true;
            
            // Also remove from socket messages
            setSocketMessages(prevSocket => 
              prevSocket.filter(msg => msg._id !== tempId)
            );
          }
        }
        
        return hasChanges ? updated : prev;
      });
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // 📊 PREPARE DATA FOR DISPLAY
  const displayMessages = allMessages();
  const tempMessageIds = Array.from(tempMessages.keys());

  return (
    <div className={`flex flex-col bg-white h-full font-inter`}>
      {isLoading ? (
        <ChatHeaderSkeleton />
      ) : isError ? (
        <div className="flex items-center justify-center h-full">
          <p>Error: {isError}</p>
        </div>
      ) : (
        showHeader && <ChatHeader user={user} onClose={onClose} />
      )}
      
      {!isConnected && (
        <div className="bg-yellow-100 text-yellow-800 text-sm p-2 text-center">
          Connection issue. Messages may not send or receive properly.
        </div>
      )}
      
      {/* Show file upload status */}
      {uploadingFile && (
        <div className="bg-blue-100 text-blue-800 text-sm p-2 text-center">
          Uploading file... Please wait.
        </div>
      )}
      
      {isLoading ? (
        <MessageListSkeleton />
      ) : isError ? (
        <div className="flex items-center justify-center h-full">
          <p>Error: {isError}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <P2PMessageList
            messages={displayMessages} 
            className={className} 
            currentUserId={getUserIdFromLocalStorage()} 
            tempMessageIds={tempMessageIds}
            onLoadMore={loadMoreMessages}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
          />
        </div>
      )}

      <ChatInput
        onSendMessage={handleSendMessage} 
        disabled={sendingMessage || uploadingFile || !isConnected}
      />
    </div>
  );
}

function getUserIdFromLocalStorage(): string {
  try {
    const userInfo = localStorage.getItem("user");
    if (!userInfo) return "agent";
    const user = JSON.parse(userInfo);
    return user._id || "agent";
  } catch (error) {
    return "agent";
  }
}