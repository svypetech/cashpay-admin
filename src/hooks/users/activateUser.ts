import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { handleTokenExpiration } from "@/src/lib/functions";

interface HandleActivateUserProps {
    id: string;
    setIsSubmitting?: Dispatch<SetStateAction<boolean>>;
    showSuccess?: (title: string, message?: string) => void;
    showError?: (title: string, message?: string) => void;
    setSuccess?: Dispatch<SetStateAction<boolean>>;
}

const handleActivateUser = async ({ 
    id, 
    setIsSubmitting, 
    showSuccess, 
    showError,
    setSuccess
}: HandleActivateUserProps) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true)
        }
        
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/activateUser`, {
            id: id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        
        if (response.data.success) {
            showSuccess && showSuccess("Success", "User activated successfully")
            setSuccess && setSuccess(true)
        } else {
            showError && showError("Activation Failed", "Failed to activate user")
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
        
        showError && showError("Error", "An error occurred while activating the user")
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export default handleActivateUser;