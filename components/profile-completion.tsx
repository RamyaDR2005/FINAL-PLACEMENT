"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  User, 
  GraduationCap, 
  MapPin, 
  FileText,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft
} from "lucide-react"

import { PersonalInfoStep } from "./steps/personal-info-step"
import { AcademicInfoStep } from "./steps/academic-info-step"
import { AddressInfoStep } from "./steps/address-info-step"
import { DocumentsInfoStep } from "./steps/documents-info-step"

import { ProfileStep, CompleteProfile } from "@/types/profile"

const PROFILE_STEPS: ProfileStep[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic personal details and contact information",
    isComplete: false
  },
  {
    id: 2,
    title: "Academic Information", 
    description: "Educational background and current academic status",
    isComplete: false
  },
  {
    id: 3,
    title: "Address & Parent Info",
    description: "Address details and parent/guardian information",
    isComplete: false
  },
  {
    id: 4,
    title: "Documents & Skills",
    description: "Upload documents and add skills, projects, achievements",
    isComplete: false
  }
]

export function ProfileCompletion() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [steps, setSteps] = useState<ProfileStep[]>(PROFILE_STEPS)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<Partial<CompleteProfile>>({})

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (session?.user) {
      fetchUserProfile()
    }
  }, [session, status, router])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          console.log("Loaded profile data:", data.profile) // Debug log
          setProfile(data.profile)
          setCurrentStep(data.profile.completionStep || 1)
          
          // Update step completion status
          setSteps(prev => prev.map(step => ({
            ...step,
            isComplete: step.id < (data.profile.completionStep || 1) || 
                       (step.id === 4 && data.profile.isComplete)
          })))
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const saveProfileStep = async (stepData: Partial<CompleteProfile>) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...stepData,
          completionStep: currentStep
        })
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => ({ ...prev, ...stepData }))
        
        // Mark current step as complete
        setSteps(prev => prev.map(step => ({
          ...step,
          isComplete: step.id <= currentStep
        })))
        
        toast.success("Profile updated successfully!")
        return true
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update profile")
        return false
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error("Error saving profile:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async (stepData: Partial<CompleteProfile>) => {
    const success = await saveProfileStep(stepData)
    if (success) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1)
      } else {
        // Profile completion
        const completeProfile = { ...stepData, isComplete: true }
        await saveProfileStep(completeProfile)
        toast.success("Profile completed successfully! Redirecting to dashboard...")
        setTimeout(() => router.push("/dashboard"), 2000)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const getStepIcon = (step: ProfileStep) => {
    const iconProps = { size: 20 }
    
    switch (step.id) {
      case 1:
        return <User {...iconProps} />
      case 2:
        return <GraduationCap {...iconProps} />
      case 3:
        return <MapPin {...iconProps} />
      case 4:
        return <FileText {...iconProps} />
      default:
        return <Circle {...iconProps} />
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={profile}
            onNext={handleNext}
            isLoading={isLoading}
          />
        )
      case 2:
        return (
          <AcademicInfoStep
            data={profile}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      case 3:
        return (
          <AddressInfoStep
            data={profile}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      case 4:
        return (
          <DocumentsInfoStep
            data={profile}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const progress = (currentStep / 4) * 100

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-muted-foreground mb-6">
          Please complete all sections to access the placement portal
        </p>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {steps.map((step) => (
            <Card 
              key={step.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                currentStep === step.id && "ring-2 ring-primary border-primary",
                step.isComplete && "bg-green-50 dark:bg-green-950/20"
              )}
              onClick={() => setCurrentStep(step.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full",
                    step.isComplete 
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step.isComplete ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      getStepIcon(step)
                    )}
                  </div>
                  {step.isComplete && (
                    <Badge variant="secondary" className="text-xs">
                      Complete
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStepIcon(steps[currentStep - 1])}
            {steps[currentStep - 1]?.title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1]?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  )
}
