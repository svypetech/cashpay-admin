"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import TransferOwnershipDialog from "@/src/components/cards/TransferOwnershipDialog";
import SuccessRedirectModal from "@/src/components/ui/SigninPopup";
import { useToast } from "@/src/lib/ToastProvider";

export default function SettingsPage() {
  // Form schema with Zod validation
  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    image: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;
  const [user, setUser] = useState<FormValues | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [image, setImage] = useState<string>("/images/blank-profile.webp");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use toast hook and router
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Initialize form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedInfo = JSON.parse(user);
        setUser(parsedInfo);
        if (parsedInfo.hasOwnProperty("name")) {
          setValue("name", parsedInfo.name);
        }
        setValue("email", parsedInfo.email);

        // Load profile image if available
        if (parsedInfo.hasOwnProperty("image")) {
          setImage(parsedInfo.image);
        }
      }
    } catch (error) {
      setErrorMessage("Error loading user data");
    }
  }, [setValue]);

  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);

      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setImage(objectUrl);
    }
  };

  // Function to trigger file input click
  const handleEditProfilePicture = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        try {
          const uploadResponse = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/updatePic`,
            { file: formData.get("image") },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // If image upload successful, get the image URL from response
          if (uploadResponse.data && uploadResponse.data.image) {
            data = { ...data, image: uploadResponse.data.image };
            setImage(uploadResponse.data.image);
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, image: uploadResponse.data.image })
            );

            if (user && user.name && user.email) {
              setUser({
                name: user.name,
                email: user.email,
                image: uploadResponse.data.image,
              });
            }
          }
        } catch (error) {
          console.error("Error uploading profile image:", error);
          showError("Upload Failed", "Failed to upload profile image");
          // Continue with form submission even if image upload fails
        }

        // Set editing to false and reload page after image upload
        setIsEditing(false);
        setImageFile(null);
        showSuccess("Success", "Profile updated successfully");
        setTimeout(() => window.location.reload(), 1500);
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
        setUser({ ...user, ...data });
        setIsEditing(false);
        setImageFile(null);
        showSuccess("Success", "Profile updated successfully");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showError("Update Failed", "Failed to update profile");
      }
    } catch (error) {
      showError("Error", "An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle edit mode
  const handleDiscard = () => {
    if (isEditing) {
      try {
        if (user) {
          setValue("email", user.email);
          setValue("name", user.name);
          setImage(user.image || "");
        }
      } catch (error) {
        showError("Error", "Error discarding changes");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleTransferOwnership = async (newOwnerID: string) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/transferOwnership`,
        { id: newOwnerID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // Close the transfer dialog and show success modal
        setShowTransferDialog(false);
        setShowSuccessModal(true);
      } else {
        showError("Transfer Failed", "Failed to transfer ownership");
      }
    } catch (error) {
      showError("Error", "An error occurred during ownership transfer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirectToSignIn = () => {
    setIsRedirecting(true);
    
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to sign in page after a short delay
    setTimeout(() => {
      router.push("/signin");
    }, 1000);
  };

  return (
    <div className="px-6 sm:px-10 py-8 font-[satoshi]">
      {/* Error Message Display for loading user data */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {errorMessage}
        </div>
      )}

      <div
        className={`flex ${
          isEditing ? "flex-col" : ""
        } sm:flex-row sm:items-center justify-between mb-4`}
      >
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Settings</h1>

        {isEditing ? (
          <div className="flex flex-row items-center gap-2 mt-5 sm:mt-0">
            <button
              type="button"
              onClick={handleDiscard}
              className="flex-1 sm:flex-none cursor-pointer px-4 py-1.5 border font-semibold border-primary rounded-md text-primary hover:bg-blue-50 text-sm sm:text-base"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none cursor-pointer px-4 py-1.5 border font-semibold border-primary rounded-md text-white bg-primary hover:bg-blue-900 text-sm sm:text-base"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer px-6 py-1.5 border font-semibold border-primary rounded-md text-primary hover:bg-blue-50 text-sm sm:text-base"
          >
            Edit
          </button>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-8">
        Manage your account settings and preferences
      </p>

      <div className="border-t border-gray-200 pt-6">
        {/* Account Information section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Account Information - 1 column */}
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold mb-1">Account Information</h2>
            <p className="text-gray-500 text-sm">Set your account details</p>
          </div>

          {/* Profile Photo and Input Fields - 3 columns */}
          <div className="md:col-span-3 mx-0 md:mx-10">
            <div className="flex flex-col gap-6">
              {/* Profile Photo - 1 column within the 3 columns */}
              <div className="md:col-span-1">
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Profile Photo
                  </h3>
                  <div className="relative w-36 h-36 overflow-hidden p-2">
                    <img
                      src={image || "/images/blank-profile.webp"}
                      alt="User avatar"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full rounded-full"
                    />

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {isEditing && (
                      <button
                        onClick={handleEditProfilePicture}
                        className="z-10 absolute top-0 right-0 p-1.5 rounded-full hover:scale-105 cursor-pointer transition-colors"
                        aria-label="Edit profile picture"
                      >
                        <Image
                          src={"/icons/edit.svg"}
                          alt="Edit avatar"
                          width={22}
                          height={22}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Input Fields - 3 columns within the 3 columns */}
              <div className="md:col-span-3">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      {...register("name")}
                      id="name"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-8 space-y-4 pt-6">
          <Link
            href={"/change-password"}
            className="w-full cursor-pointer border-b border-gray-200 flex items-center justify-between py-3 px-1 text-left group hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="mr-3 text-gray-400">
                <Image
                  src="/icons/lock-icon.svg"
                  alt="Lock Icon"
                  width={20}
                  height={20}
                  className="h-6 w-6"
                />
              </div>
              <span className="font-medium text-gray-500 ">Change password</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </Link>
          
          <button
            onClick={() => setShowTransferDialog(true)}
            className="w-full cursor-pointer border-b border-gray-200 flex items-center justify-between py-3 px-1 text-left rounded-md group hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="mr-3 text-gray-400">
                <Image
                  src="/icons/profile-2user.svg"
                  alt="accounts"
                  width={20}
                  height={20}
                  className="h-6 w-6"
                />
              </div>
              <span className="font-medium text-gray-500">Transfer Ownership</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </div>

      {/* Transfer Ownership Dialog */}
      <TransferOwnershipDialog
        isOpen={showTransferDialog}
        onCancel={() => setShowTransferDialog(false)}
        onConfirm={handleTransferOwnership}
        isLoading={isSubmitting}
      />

      {/* Success Modal for Ownership Transfer */}
      <SuccessRedirectModal
        isOpen={showSuccessModal}
        onRedirect={handleRedirectToSignIn}
        title="Ownership Transferred Successfully"
        message="Your ownership has been transferred successfully. You need to sign in again to continue."
        infoText="*You will be redirected to the sign-in page"
        buttonText="Sign In Again"
        isLoading={isRedirecting}
      />
    </div>
  );
}