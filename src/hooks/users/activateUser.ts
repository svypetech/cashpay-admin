import axios from "axios"
import { Dispatch, SetStateAction } from "react"

const handleActivateUser = async (id: string, setIsSubmitting?: Dispatch<SetStateAction<boolean>>) => {
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
            alert("User activated successfully")
        }
        else {
            alert("Failed to activate User")
        }
    } catch (error) {
        console.error("Error activating User:", error)
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export default handleActivateUser;