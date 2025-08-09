"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ChatUser, P2PMessage } from "@/src/Types/chat";
import { handleTokenExpiration } from "@/src/lib/functions";

export default function useFetchP2PChat({
  chatId,
  setChatSidebarOpen,
}: {
  chatId: string;
  setChatSidebarOpen: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<P2PMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [currentChatUser, setCurrentChatUser] = useState<ChatUser>(
    {} as ChatUser
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 📚 INITIAL LOAD - Only API messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId === "") return;

      setChatSidebarOpen(true);
      setIsLoading(true);
      setCurrentPage(1);
      setHasMore(true); // Reset hasMore on new chat

      try {
        console.log(`📚 P2P API: Initial load for orderId: ${chatId}`);
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/help/chat/orderChat?limit=20&page=1&orderId=${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log('📚 P2P API Response:', response.data);

        const chatMessages = response.data.data || [];
        console.log(`📚 P2P API: Initial load - ${chatMessages.length} messages`);

        setMessages(chatMessages);
        setCurrentChatUser({
          userName: response.data.userDetails?.name || "Unknown User",
          userImage: response.data.userDetails?.image || ""
        });
        setHasMore(chatMessages.length >= 20); // Has more if we got full page
        setIsError(null);
      } catch (error: any) {
        // Check if the error is due to unauthorized access (401)
        if (error.response?.status === 401 || 
            error.response?.data?.statusCode === 401 ||
            error.response?.data?.message?.includes("Invalid or expired token")) {
          console.log("Token expired or invalid, redirecting to sign-in");
          handleTokenExpiration();
          return; // Don't set error state, just redirect
        }
        
        console.error("❌ P2P API: Error fetching messages:", error);
        setIsError(error.response?.data?.error || "Failed to load messages");
        setMessages([]); // Clear messages on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, setChatSidebarOpen]);

  // 📚 LOAD MORE MESSAGES - Only for infinite scroll (API messages)
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || chatId === "" || !hasMore) {
      console.log(`📚 P2P API: Skipping loadMore - isLoadingMore: ${isLoadingMore}, chatId: ${chatId}, hasMore: ${hasMore}`);
      return;
    }

    setIsLoadingMore(true);
    console.log(`📚 P2P API: Loading more - page ${currentPage + 1}`);

    try {
      // Use the same endpoint as initial load but with different page
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/help/chat/orderChat?limit=20&page=${
          currentPage + 1
        }&orderId=${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log('📚 P2P API LoadMore Response:', response.data);

      // Handle the response structure based on your API
      const olderMessages: P2PMessage[] = response.data.data || [];
      console.log(`📚 P2P API: Fetched ${olderMessages.length} older messages`);

      if (olderMessages.length === 0) {
        console.log('📚 P2P API: No more messages available');
        setHasMore(false);
      } else {
        // ✨ ONLY UPDATE API MESSAGES - socket messages are handled separately
        setMessages((prevMessages) => {
          const existingIds = new Set(prevMessages.map((msg) => msg._id));
          const messagesToAdd = olderMessages.filter(
            (msg: P2PMessage) => !existingIds.has(msg._id)
          );

          if (messagesToAdd.length > 0) {
            // Add older messages to the beginning, keep sorted by date
            const newMessages = [...messagesToAdd, ...prevMessages].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            console.log(
              `📚 P2P API: Added ${messagesToAdd.length} messages, total now: ${newMessages.length}`
            );
            return newMessages;
          }

          console.log('📚 P2P API: No new messages to add (all duplicates)');
          return prevMessages;
        });

        setCurrentPage(currentPage + 1);
        
        // Check if we got less than requested, means no more pages
        if (olderMessages.length < 20) {
          console.log('📚 P2P API: Got less than 20 messages, no more pages');
          setHasMore(false);
        }
      }
    } catch (error: any) {
      // Check if the error is due to unauthorized access (401)
      if (error.response?.status === 401 || 
          error.response?.data?.statusCode === 401 ||
          error.response?.data?.message?.includes("Invalid or expired token")) {
        console.log("Token expired or invalid, redirecting to sign-in");
        handleTokenExpiration();
        return; // Don't set error state, just redirect
      }
      
      console.error("❌ P2P API: Error loading more messages:", error);
      setIsError(error.response?.data?.error || "Failed to load more messages");
    } finally {
      setIsLoadingMore(false);
    }
  }, [chatId, currentPage, hasMore, isLoadingMore]);

  // Reset states when chatId changes
  useEffect(() => {
    setMessages([]);
    setIsError(null);
    setCurrentPage(1);
    setHasMore(true);
  }, [chatId]);

  return {
    messages,
    isLoading,
    isLoadingMore,
    isError,
    currentChatUser,
    setMessages,
    setCurrentChatUser,
    loadMoreMessages,
    hasMore,
  };
}