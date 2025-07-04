"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { ChatUser, Message } from "@/src/Types/chat";
import { useSocket } from "@/src/hooks/support/useSocket";
import { useToast } from "@/src/lib/ToastProvider";
import ChatHeaderSkeleton from "../skeletons/ChatHeaderSkeleton";
import MessageListSkeleton from "../skeletons/MessageListSkeleton";

interface ChatProps {
  chatId: string;
  user: ChatUser;
  initialMessages?: Message[];
  onClose?: () => void;
  showHeader?: boolean;
  className?: string;
  isLoading?: boolean;
  isError?: string | null;
  loadMoreMessages?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

export default function Chat({
  chatId,
  user,
  initialMessages = [],
  onClose,
  showHeader = true,
  className,
  isLoading = false, 
  isError = null, 
  loadMoreMessages = () => {},
  isLoadingMore = false,
  hasMore = false,
}: ChatProps) {
  const { sendMessage, sendFile, onNewMessage, isConnected } = useSocket(chatId);
  const { showError, showSuccess } = useToast();
  
  // ✨ DUAL ARRAY SYSTEM
  const [apiMessages, setApiMessages] = useState<Message[]>(initialMessages);
  const [socketMessages, setSocketMessages] = useState<Message[]>([]);
  const [tempMessages, setTempMessages] = useState<Map<string, Message>>(new Map());
  
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const socketConnectionTime = useRef<number>(Date.now());

  // 🔄 COMBINED MESSAGES FOR DISPLAY
  const allMessages = useCallback(() => {
    const combined = [...apiMessages, ...socketMessages];
    
    const uniqueMessages = combined.reduce((acc, current) => {
      const existing = acc.find(msg => msg._id === current._id);
      if (!existing) {
        acc.push(current);
      } else if (current._id.startsWith('temp-') && !existing._id.startsWith('temp-')) {
        const index = acc.findIndex(msg => msg._id === existing._id);
        acc[index] = existing;
      }
      return acc;
    }, [] as Message[]);
    
    return uniqueMessages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [apiMessages, socketMessages]);

  // 📨 HANDLE NEW MESSAGES FROM SOCKET
  useEffect(() => {
    const cleanupListener = onNewMessage((newMessages, isRefetch) => {
      if (isRefetch) {
        setApiMessages(prev => {
          const existingIds = new Set([...prev.map(m => m._id), ...socketMessages.map(m => m._id)]);
          const trulyNewMessages = newMessages.filter(msg => !existingIds.has(msg._id));
          
          if (trulyNewMessages.length > 0) {
            return [...prev, ...trulyNewMessages];
          }
          return prev;
        });
      } else {
        const newMessage = newMessages[0];
        
        if (newMessage && newMessage.ticketId === chatId) {
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
              
              console.log('Comparing files:', {
                tempFileName,
                serverFileName,
                serverMessage,
                tempMessage: tempMsg.message,
                match: tempFileName === serverFileName
              });
              
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
            console.log('Replacing temp message:', tempIdToReplace, 'with confirmed message:', newMessage._id);
            
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
            console.log('No temp message found to replace, adding as new message:', newMessage._id);
            
            // Add as new message if no temp message to replace
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
          
          const tempMessage: Message = {
            _id: tempId,
            message: text.trim() || `📎 ${file.name}`, // Match the file message format
            isRead: false,
            isReplied: false,
            senderType: "support agent",
            ticketId: chatId,
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
          showError("Upload Failed", "Failed to upload file");
        }
      } catch (error) {
        showError("Upload Error", "An error occurred while uploading the file");
      } finally {
        setUploadingFile(false);
      }
    } else {
      // Handle text message
      setSendingMessage(true);
      try {
        const { success, tempId } = await sendMessage(text, chatId);
        
        if (success && tempId) {
          const tempMessage: Message = {
            _id: tempId,
            message: text,
            isRead: false,
            isReplied: false,
            senderType: "support agent",
            ticketId: chatId,
            date: new Date().toISOString(),
            sender: currentUserId || "agent",
            __v: 0,
          };
          
          setTempMessages(prev => new Map(prev).set(tempId, tempMessage));
          setSocketMessages(prev => [...prev, tempMessage]);
        } else {
          showError("Send Failed", "Failed to send message");
        }
      } catch (error) {
        showError("Send Error", "An error occurred while sending the message");
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

  // 🔄 UPDATE API MESSAGES WHEN INITIAL MESSAGES CHANGE
  useEffect(() => {
    setApiMessages(initialMessages);
  }, [initialMessages]);

  // 🕒 CLEANUP TEMP MESSAGES AFTER TIMEOUT
  useEffect(() => {
    const interval = setInterval(() => {
      setTempMessages(prev => {
        const updated = new Map(prev);
        let hasChanges = false;
        
        for (const [tempId, tempMsg] of updated.entries()) {
          const age = Date.now() - new Date(tempMsg.date).getTime();
          if (age > 30000) {
            updated.delete(tempId);
            hasChanges = true;
            
            setSocketMessages(prevSocket => 
              prevSocket.filter(msg => msg._id !== tempId)
            );
          }
        }
        
        return hasChanges ? updated : prev;
      });
    }, 5000);
    
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
          <MessageList 
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