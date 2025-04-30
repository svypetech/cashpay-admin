"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail, Lock, Loader2 } from "lucide-react"
import Image from "next/image"

// Define the form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call
      console.log("Form data:", data)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect or handle successful login
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row justify-center">
      {/* Left side - Login form */}
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center px-6 py-6 lg:px-8 xl:px-24">
        <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
          <h1 className="mt-6 text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome back, <span className="text-secondary">Admin!</span>
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                E-mail
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Image src={'/icons/email-icon.svg'} alt="Email Icon" height={20} width={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ${
                    errors.email ? "ring-red-300 focus:ring-red-500" : "ring-gray-300 focus:ring-gray-400"
                  } placeholder:text-gray-400 focus:ring focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="Enter your e-mail"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Image src={'/icons/lock-icon.svg'} alt="Email Icon" height={20} width={20} />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ${
                    errors.password ? "ring-red-300 focus:ring-red-500" : "ring-gray-300 focus:ring-gray-400"
                  } placeholder:text-gray-400 focus:ring focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="Enter password"
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center cursor-pointer rounded-md bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-900  disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden xl:flex md:w-1/2 flex-col items-center justify-center bg-[#001233] text-white relative">
        <Image
          src={"/icons/signinIcon.svg"}
          alt="Background"
          fill
          className="object-cover object-center h-full w-full"
          priority
        />
      </div>
    </div>
  )
}