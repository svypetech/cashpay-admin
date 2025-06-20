"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Toast, ToastType } from "../components/ui/toast";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showToast = (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = generateId();
    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      duration,
    };

    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title: string, message?: string, duration?: number) => {
    showToast("success", title, message, duration);
  };

  const showError = (title: string, message?: string, duration?: number) => {
    showToast("error", title, message, duration);
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    showToast("warning", title, message, duration);
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    showToast("info", title, message, duration);
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      
      {/* Toast Container - Fixed position at bottom right */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};