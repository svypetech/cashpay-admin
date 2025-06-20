"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ConfirmDialog from "@/src/components/cards/ConfirmDialog";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the form schema with Zod
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = () => {
    setShowConfirmation(true);
  };

  const handleConfirmChange = async () => {
    setErrorMessage("") 
    setIsSubmitting(true);
    try {
      const formData = getValues();

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/changePassword`,
        {
          oldpassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Password changed successfully")
        router.push("/settings");
      } else {
        setErrorMessage("Failed to change password, please try again later")
        router.push("/settings");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setErrorMessage("Failed to change password, please try again later")
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-[satoshi]">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Change Password</h1>
        <p className="text-gray-600 text-center mb-6">
          Please enter your new Password to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              className={`w-full px-3 py-2 border ${
                errors.currentPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500`}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              className={`w-full px-3 py-2 border ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500`}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className={`w-full px-3 py-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-900 cursor-pointer text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmation}
        title="Confirm Password Change"
        message="Are you sure you want to change your password?"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleConfirmChange}
        isLoading={isSubmitting}
      />
    </div>
  );
}
