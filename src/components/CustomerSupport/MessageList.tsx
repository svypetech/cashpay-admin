"use client";
import { useMemo, useRef, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import InfiniteScroll from "react-infinite-scroll-component";
import MessageItem from './MessageItem';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import { groupMessagesByDate } from '@/src/lib/functions';
import { Message } from '@/src/Types/chat';

interface MessageListProps {
  messages: Message[];
  className?: string;
  currentUserId: string;
  tempMessageIds?: string[];
  onLoadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
}

export default function MessageList({ 
  messages, 
  className, 
  currentUserId,
  tempMessageIds = [],
  onLoadMore,
  isLoadingMore,
  hasMore
}: MessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);
  const prevScrollTop = useRef<number>(0);

  // Process messages to only show read status on the most recent read/unread message
  const processedMessages = useMemo(() => {
    const result = [...messages];
    
    // Find the last message from current user that is read and unread
    let lastReadIndex = -1;
    let lastUnreadIndex = -1;
    
    for (let i = result.length - 1; i >= 0; i--) {
      const msg = result[i];
      const isFromCurrentUser = msg.sender === currentUserId || msg.senderType === "support agent";
      
      if (isFromCurrentUser) {
        if (msg.isRead && lastReadIndex === -1) {
          lastReadIndex = i;
        } else if (!msg.isRead && lastUnreadIndex === -1) {
          lastUnreadIndex = i;
        }
      }
      
      // Add showStatus property to each message
      result[i] = {
        ...msg,
        showStatus: (i === lastReadIndex || i === lastUnreadIndex) && 
                   (msg.sender === currentUserId || msg.senderType === "support agent")
      };
    }
    
    return result;
  }, [messages, currentUserId]);

  // Group messages by date - oldest to newest
  const messageGroups = useMemo(() => {
    return groupMessagesByDate(processedMessages);
  }, [processedMessages]);

  // Save scroll position before loading more
  useEffect(() => {
    if (isLoadingMore && scrollContainerRef.current) {
      prevScrollHeight.current = scrollContainerRef.current.scrollHeight;
      prevScrollTop.current = scrollContainerRef.current.scrollTop;
    }
  }, [isLoadingMore]);

  // Restore scroll position after loading more
  useEffect(() => {
    if (!isLoadingMore && prevScrollHeight.current > 0 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const newScrollHeight = container.scrollHeight;
      const heightDifference = newScrollHeight - prevScrollHeight.current;
      
      if (heightDifference > 0) {
        container.scrollTop = prevScrollTop.current + heightDifference;
      }
      
      // Reset stored values
      prevScrollHeight.current = 0;
      prevScrollTop.current = 0;
    }
  }, [messages.length, isLoadingMore]);

  // Format date in a user-friendly way
  const formatChatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      
      // Check if valid date
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      
      if (isToday(date)) {
        return 'Today';
      } else if (isYesterday(date)) {
        return 'Yesterday';
      } else {
        // For this year, show month and day
        const currentYear = new Date().getFullYear(); 
        const messageYear = date.getFullYear();
        
        if (messageYear === currentYear) {
          // Within last 7 days, show day name
          const dayDiff = differenceInDays(new Date(), date);
          if (dayDiff < 7) {
            return format(date, 'EEEE'); // Monday, Tuesday, etc.
          }
          
          // Same year but older than 7 days
          return format(date, 'MMMM d'); // May 16
        } else {
          // Different year
          return format(date, 'MMM d, yyyy'); // May 16, 2024
        }
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString; // Return original on error
    }
  };
  
  return (
    <div className={`flex-1 overflow-hidden ${className || ''}`} style={{ height: '100%' }}>
      <ScrollToBottom
        className="h-full"
        followButtonClassName="hidden"
        initialScrollBehavior="auto"
        mode="bottom"
      >
        <div 
          id="scrollableDiv"
          ref={scrollContainerRef}
          style={{ 
            height: '100%', 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse' // This makes infinite scroll work from top
          }}
        >
          {/* Show empty state when there are no messages */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="bg-gray-100 rounded-full p-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="#9CA3AF"/>
                  <path d="M12 9H14V11H12V9Z" fill="#9CA3AF"/>
                  <path d="M10 9H12V11H10V9Z" fill="#9CA3AF"/>
                  <path d="M14 7H16V9H14V7Z" fill="#9CA3AF"/>
                </svg>
              </div>
              <p className="mt-2 text-gray-500">No messages yet</p>
              <p className="text-gray-400 text-sm">Start the conversation by sending a message</p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={messages.length}
              next={onLoadMore}
              hasMore={hasMore && messages.length > 0} // Only show hasMore if we have messages
              loader={
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                </div>
              }
              scrollableTarget="scrollableDiv"
              inverse={true} // Load more at the top
              style={{ 
                display: 'flex', 
                flexDirection: 'column-reverse',
                padding: '16px 16px 8px 16px' // Reduced bottom padding
              }}
            >
              {/* Display messages in date groups (reversed for column-reverse) */}
              {messageGroups.slice().reverse().map((group, groupIndex, array) => (
                <div 
                  key={groupIndex} 
                  className={groupIndex === 0 ? "mb-2" : "mb-6"} // Less margin for last group (first in reverse)
                  style={{ display: 'flex', flexDirection: 'column-reverse' }}
                >
                  {/* Messages for this date group (reversed) */}
                  <div 
                    className="mb-2" 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column-reverse',
                      gap: '12px' // Consistent spacing between messages
                    }}
                  >
                    {group.messages.slice().reverse().map((message, index) => {
                      // Only consider a message temporary if its ID is actually in the tempMessageIds array
                      // AND it still has a temp- prefix
                      const isTemporary = tempMessageIds.includes(message._id) && 
                                         message._id.startsWith('temp-');
                      
                      // Debug logging for temp messages
                      if (message._id.startsWith('temp-') || tempMessageIds.length > 0) {
                        console.log(`🔍 MESSAGE CHECK:`, {
                          messageId: message._id,
                          isTemporary,
                          startsWithTemp: message._id.startsWith('temp-'),
                          inTempIds: tempMessageIds.includes(message._id),
                          tempMessageIds: tempMessageIds,
                          content: message.message.substring(0, 20) + '...'
                        });
                      }
                      
                      return (
                        <MessageItem 
                          key={`${message._id}-${index}`} 
                          message={message} 
                          isFromCurrentUser={message.sender === currentUserId || message.senderType === "support agent"}
                          isTemp={isTemporary}
                          showStatus={message.showStatus}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Date with horizontal lines */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="h-[1px] bg-primary7 flex-grow"></div>
                    <span className="text-xs text-primary2 font-[500] px-3">
                      {formatChatDate(group.date)}
                    </span>
                    <div className="h-[1px] bg-primary7 flex-grow"></div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </ScrollToBottom>
    </div>
  );
}