import axios from "axios"
import { Dispatch, SetStateAction } from "react"

export const handleActivateAdmin = async (id: string, setIsSubmitting?: Dispatch<SetStateAction<boolean>>) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true)
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/activateUser`, {
            id: id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        if (response.data.success) {
            // Don't show alert here, let the calling component handle it
            return Promise.resolve()
        } else {
            throw new Error("Failed to activate admin")
        }
    } catch (error) {
        console.error("Error activating admin:", error)
        throw error
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}



export const handleBanAdmin = async (id: string, setIsSubmitting?: Dispatch<SetStateAction<boolean>>) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true)
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/banUser`, {
            id: id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        console.log("Response:", response.data)
        if (response.data.success) {
            // Don't show alert here, let the calling component handle it
            return Promise.resolve()
        } else {
            throw new Error("Failed to ban admin")
        }
    } catch (error) {
        console.error("Error banning admin:", error)
        throw error
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}

export const handleSuspendAdmin = async (id: string, setIsSubmitting?: Dispatch<SetStateAction<boolean>>) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true)
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/suspendUser`, {
            id: id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        console.log("Response:", response.data)
        if (response.data.success) {
            // Don't show alert here, let the calling component handle it
            return Promise.resolve()
        } else {
            throw new Error("Failed to suspend admin")
        }
    } catch (error) {
        console.error("Error suspending admin:", error)
        throw error
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}


export const handleDeleteAdmin = async (id: string, setIsSubmitting?: Dispatch<SetStateAction<boolean>>) => {
    try {
        if (setIsSubmitting) {
            setIsSubmitting(true)
        }
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/deleteAdmin`, {
            data: { id: id },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        if (response.data.success) {
            // Don't show alert here, let the calling component handle it
            return Promise.resolve()
        } else {
            throw new Error("Failed to delete admin")
        }
    } catch (error) {
        console.error("Error deleting admin:", error)
        throw error
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false)
        }
    }
}
