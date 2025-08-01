import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { handleTokenExpiration } from "@/src/lib/functions";

interface HandleBanUserProps {
    id: string;
    setIsSubmitting?: Dispatch<SetStateAction<boolean>>;
    showSuccess?: (title: string, message?: string) => void;
    showError?: (title: string, message?: string) => void;
    setSuccess?: Dispatch<SetStateAction<boolean>>;
}

const handleBanUser = async ({ 
    id, 
    setIsSubmitting, 
    showSuccess, 
    showError,
    setSuccess 
}: HandleBanUserProps) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true)
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/banUser`, {
            id: id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        if (response.data.success) {
            // Send notification after successful ban
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/`, {
                    userId: id,
                    title: "Account Banned",
                    message: "Your account has been permanently banned. Please contact support if you believe this is an error."
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
            } catch (notificationError) {
                // Don't fail the main operation if notification fails
            }

            showSuccess && showSuccess("Success", "User banned successfully")
            setSuccess && setSuccess(true)
        } else {
            showError && showError("Ban Failed", "Failed to ban user")
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
        
        showError && showError("Error", "An error occurred while banning the user")
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export default handleBanUser;