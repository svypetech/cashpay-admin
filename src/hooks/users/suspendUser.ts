import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { handleTokenExpiration } from "@/src/lib/functions";

interface HandleSuspendUserProps {
    id: string;
    setIsSubmitting?: Dispatch<SetStateAction<boolean>>;
    showSuccess?: (title: string, message?: string) => void;
    showError?: (title: string, message?: string) => void;
    setSuccess?: Dispatch<SetStateAction<boolean>>;
    days: number; // Optional, if you want to pass days for suspension
}

const handleSuspendUser = async ({ 
    id, 
    setIsSubmitting, 
    showSuccess, 
    showError,
    setSuccess,
    days 
}: HandleSuspendUserProps) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true)
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/suspendUser`, {
            id: id,
            days: days, 
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        if (response.data.success) {
            // Send notification after successful suspension
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/`, {
                    userId: id,
                    title: "Account Suspended",
                    message: `Your account has been suspended for ${days} days. Please contact support for more information.`
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
            } catch (notificationError) {
                // Don't fail the main operation if notification fails
            }

            showSuccess && showSuccess("Success", "User suspended successfully")
            setSuccess && setSuccess(true)
            return Promise.resolve();
        } else {
            showError && showError("Suspend Failed", "Failed to suspend user")
            throw new Error("Failed to suspend user");
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
        
        showError && showError("Error", "An error occurred while suspending the user")
        throw error;
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export default handleSuspendUser;