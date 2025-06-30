"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ChatUser, Message } from "@/src/Types/chat";

export default function useFetchChat({
  chatId, 
  setChatSidebarOpen
}: {
  chatId: string, 
  setChatSidebarOpen: (open: boolean) => void
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [currentChatUser, setCurrentChatUser] = useState<ChatUser>({} as ChatUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 📚 INITIAL LOAD - Only API messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId === "") return;
      
      setChatSidebarOpen(true);
      setIsLoading(true);
      setCurrentPage(1);
      
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/help/chat/all?limit=20&page=1&ticketId=${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        const chatMessages = response.data.chat.data.chats || [];
        console.log(`📚 API: Initial load - ${chatMessages.length} messages`);
        
        setMessages(chatMessages);
        setCurrentChatUser(response.data.userDetails);
        setHasMore(chatMessages.length >= 20); // Has more if we got full page
        setIsError(null);
        
      } catch (error: any) {
        console.error("❌ API: Error fetching messages:", error);
        setIsError(error.response?.data?.error || "Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [chatId, setChatSidebarOpen]);

  // 📚 LOAD MORE MESSAGES - Only for infinite scroll (API messages)
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || chatId === "" || !hasMore) return;
    
    setIsLoadingMore(true);
    console.log(`📚 API: Loading more - page ${currentPage + 1}`);
    
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/help/chat/all?limit=20&page=${currentPage + 1}&ticketId=${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      const olderMessages: Message[] = response.data.chat.data.chats || [];
      console.log(`📚 API: Fetched ${olderMessages.length} older messages`);
      
      if (olderMessages.length === 0) {
        setHasMore(false);
      } else {
        // ✨ ONLY UPDATE API MESSAGES - socket messages are handled separately
        setMessages(prevMessages => {
          const existingIds = new Set(prevMessages.map(msg => msg._id));
          const messagesToAdd = olderMessages.filter((msg: Message) => !existingIds.has(msg._id));
          
          if (messagesToAdd.length > 0) {
            // Add older messages to the beginning, keep sorted by date
            const newMessages = [...messagesToAdd, ...prevMessages].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            
            console.log(`📚 API: Added ${messagesToAdd.length} messages, total now: ${newMessages.length}`);
            return newMessages;
          }
          
          return prevMessages;
        });
        
        setCurrentPage(currentPage + 1);
      }
    } catch (error: any) {
      console.error("❌ API: Error loading more messages:", error);
      setIsError(error.response?.data?.error || "Failed to load more messages");
    } finally {
      setIsLoadingMore(false);
    }
  }, [chatId, currentPage, hasMore, isLoadingMore]);

  return { 
    messages, 
    isLoading, 
    isLoadingMore,
    isError, 
    currentChatUser,
    setMessages,
    setCurrentChatUser,
    loadMoreMessages,
    hasMore
  };
}