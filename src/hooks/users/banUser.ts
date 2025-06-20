import axios from "axios"
import { Dispatch, SetStateAction } from "react"

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
        console.log("Response:", response.data)
        if (response.data.success) {
            showSuccess && showSuccess("Success", "User banned successfully")
            setSuccess && setSuccess(true)
        } else {
            showError && showError("Ban Failed", "Failed to ban user")
        }
    } catch (error) {
        console.error("Error banning user:", error)
        showError && showError("Error", "An error occurred while banning the user")
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export default handleBanUser;