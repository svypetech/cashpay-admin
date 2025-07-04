import axios from "axios"
import { Dispatch, SetStateAction } from "react"

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
    } catch (error) {
        showError && showError("Error", "An error occurred while activating the user")
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export default handleActivateUser;