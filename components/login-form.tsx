"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)

  React.useEffect(() => {
    // Only access searchParams on the client side
    setSearchParams(new URLSearchParams(window.location.search))
  }, [])

  // Show messages based on URL parameters
  React.useEffect(() => {
    if (!searchParams) return
    
    const success = searchParams.get("success")
    const error = searchParams.get("error")
    const message = searchParams.get("message")
    
    if (success === "email-verified") {
      toast.success("Email verified successfully! You can now sign in.")
    } else if (error === "missing-token") {
      toast.error("Invalid verification link.")
    } else if (error === "verification-failed") {
      toast.error("Email verification failed. Please try again.")
    } else if (error && error.includes("token")) {
      toast.error("Verification link is invalid or expired.")
    } else if (message === "check-email") {
      toast.info("Please check your email and verify your account before signing in.")
    }
  }, [searchParams])

  const handleResendVerification = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address first")
      return
    }

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Verification email sent! Please check your inbox.")
      } else {
        toast.error(data.error || "Failed to send verification email")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error("Resend verification error:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "Please verify your email before signing in.") {
          toast.error(
            <div className="flex flex-col gap-2">
              <span>Please verify your email before signing in.</span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleResendVerification}
                className="w-fit"
              >
                Resend verification email
              </Button>
            </div>,
            { duration: 10000 }
          )
        } else {
          toast.error("Invalid email or password")
        }
      } else if (result?.ok) {
        toast.success("Signed in successfully!")
        
        // Check if user has completed profile
        try {
          const profileResponse = await fetch("/api/profile")
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            if (profileData.profile?.isComplete) {
              router.push("/dashboard")
            } else {
              router.push("/profile")
            }
          } else {
            // If profile check fails, redirect to profile completion
            router.push("/profile")
          }
        } catch (error) {
          // If there's an error checking profile, redirect to profile
          router.push("/profile")
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/profile" })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Email or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
