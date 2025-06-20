import axios from "axios"
import { set } from "date-fns";
import { Dispatch, SetStateAction } from "react"

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
        console.log("Response:", response.data)
        if (response.data.success) {
            showSuccess  && showSuccess("Success", "User suspended successfully")
            setSuccess && setSuccess(true)
        } else {
            showError && showError("Suspend Failed", "Failed to suspend user")
        }
    } catch (error) {
        console.error("Error suspending user:", error)
        showError && showError("Error", "An error occurred while suspending the user")
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export default handleSuspendUser;