import axios from "axios"
import { Dispatch, SetStateAction } from "react"

const handleSuspendUser = async (id: string, setIsSubmitting?: Dispatch<SetStateAction<boolean>>) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true)
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/suspendUser`, {
            id: id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        console.log("Response:", response.data)
        if (response.data.success) {
            alert("User suspended successfully")
        }
        else {
            alert("Failed to suspend user")
        }
    } catch (error) {
        console.error("Error suspending user:", error)
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export default handleSuspendUser;