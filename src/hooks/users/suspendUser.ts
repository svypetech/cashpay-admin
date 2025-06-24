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
            // Send notification after successful suspension
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/`, {
                    userId: id,
                    title: "Account Suspended",
                    message: `Your account ${id} has been suspended for ${days} days. Please contact support for more information.`
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                console.log("Suspension notification sent successfully");
            } catch (notificationError) {
                console.error("Error sending suspension notification:", notificationError);
                // Don't fail the main operation if notification fails
            }

            showSuccess && showSuccess("Success", "User suspended successfully")
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