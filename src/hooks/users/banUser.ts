import axios from "axios"
import { Dispatch, SetStateAction } from "react"

const handleBanUser = async (id: string, setIsSubmitting?: Dispatch<SetStateAction<boolean>>) => {
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
            alert("User banned successfully")
        }
        else {
            alert("Failed to ban User")
        }
    } catch (error) {
        console.error("Error banning User:", error)
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export default handleBanUser;