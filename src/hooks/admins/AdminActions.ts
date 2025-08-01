import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { handleTokenExpiration } from "@/src/lib/functions";

interface AdminActionProps {
    id: string;
    setIsSubmitting?: Dispatch<SetStateAction<boolean>>;
    showSuccess?: (title: string, message?: string) => void;
    showError?: (title: string, message?: string) => void;
    setSuccess?: Dispatch<SetStateAction<boolean>>;
    days?: number; // Optional, for future suspension days feature
}

export const handleActivateAdmin = async ({ 
    id, 
    setIsSubmitting, 
    showSuccess, 
    showError,
    setSuccess 
}: AdminActionProps) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true);
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/activateUser`, {
            id: id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        if (response.data.success) {
            showSuccess && showSuccess("Success", "Admin activated successfully");
            setSuccess && setSuccess(true);
            return Promise.resolve();
        } else {
            showError && showError("Activation Failed", "Failed to activate admin");
            throw new Error("Failed to activate admin");
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
        
        showError && showError("Error", "An error occurred while activating the admin");
        throw error;
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false);
        }
    }
}

export const handleBanAdmin = async ({ 
    id, 
    setIsSubmitting, 
    showSuccess, 
    showError,
    setSuccess 
}: AdminActionProps) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true);
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/banUser`, {
            id: id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        if (response.data.success) {
            showSuccess && showSuccess("Success", "Admin banned successfully");
            setSuccess && setSuccess(true);
            return Promise.resolve();
        } else {
            showError && showError("Ban Failed", "Failed to ban admin");
            throw new Error("Failed to ban admin");
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
        
        showError && showError("Error", "An error occurred while banning the admin");
        throw error;
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false);
        }
    }
}

export const handleSuspendAdmin = async ({ 
    id, 
    setIsSubmitting, 
    showSuccess, 
    showError,
    setSuccess,
    days 
}: AdminActionProps) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true);
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/suspendUser`, {
            id: id,
            days: days // Include days if provided
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        if (response.data.success) {
            showSuccess && showSuccess("Success", "Admin suspended successfully");
            setSuccess && setSuccess(true);
            return Promise.resolve();
        } else {
            showError && showError("Suspend Failed", "Failed to suspend admin");
            throw new Error("Failed to suspend admin");
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
        
        showError && showError("Error", "An error occurred while suspending the admin");
        throw error;
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false);
        }
    }
}

export const handleDeleteAdmin = async ({ 
    id, 
    setIsSubmitting, 
    showSuccess, 
    showError,
    setSuccess 
}: AdminActionProps) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true);
        }
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/deleteAdmin`, {
            data: { id: id },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        if (response.data.success) {
            showSuccess && showSuccess("Success", "Admin deleted successfully");
            setSuccess && setSuccess(true);
            return Promise.resolve();
        } else {
            showError && showError("Delete Failed", "Failed to delete admin");
            throw new Error("Failed to delete admin");
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
        
        showError && showError("Error", "An error occurred while deleting the admin");
        throw error;
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false);
        }
    }
}
