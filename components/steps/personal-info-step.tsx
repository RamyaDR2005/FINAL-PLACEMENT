import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { PersonalInfo } from "@/types/profile"
import { uploadFile, getUploadConfig } from "@/lib/upload-helpers"

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  usn: z.string().min(5, "USN must be at least 5 characters").toUpperCase(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid phone number"),
  alternatePhone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  dateOfBirth: z.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  bloodGroup: z.string().optional(),
})

type PersonalInfoForm = z.infer<typeof personalInfoSchema>

interface PersonalInfoStepProps {
  data: Partial<PersonalInfo>
  onNext: (data: Partial<PersonalInfo>) => Promise<void>
  isLoading: boolean
}

export function PersonalInfoStep({ data, onNext, isLoading }: PersonalInfoStepProps) {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(data.profilePhoto || null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.profilePhoto || null)
  const [isUploading, setIsUploading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      usn: data.usn || "",
      phone: data.phone || "",
      alternatePhone: data.alternatePhone || "",
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender || undefined,
      bloodGroup: data.bloodGroup || "",
    }
  })

  const dateOfBirth = watch("dateOfBirth")

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Immediately create preview from file
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewUrl(result)
      setImageError(false)
      toast.success("Image loaded for preview!")
    }
    reader.readAsDataURL(file)

    // Upload to R2 in background
    setIsUploading(true)
    try {
      const config = getUploadConfig("profile-photo")
      const result = await uploadFile(file, "profile-photo", config)
      
      if (result.success && result.url) {
        setProfilePhoto(result.url)
        console.log("Profile photo uploaded to R2:", result.url) // Debug log
        toast.success("Profile photo uploaded to cloud storage!")
      } else {
        toast.error(result.error || "Failed to upload profile photo to cloud")
        // Keep the preview even if upload fails
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload to cloud storage, but preview is saved")
      // Keep the preview even if upload fails
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (formData: PersonalInfoForm) => {
    const submissionData = {
      ...formData,
      profilePhoto: profilePhoto || undefined,
      alternatePhone: formData.alternatePhone || undefined,
    }
    
    console.log("Submitting personal info data:", submissionData) // Debug log
    await onNext(submissionData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Photo */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900">
          {(previewUrl || profilePhoto) && !imageError ? (
            <img 
              src={previewUrl || profilePhoto || ""} 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={() => {
                console.error("Failed to load image:", previewUrl || profilePhoto)
                setImageError(true)
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", previewUrl || profilePhoto)
                setImageError(false)
              }}
            />
          ) : (
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-bold text-gray-500">
                {imageError ? "Failed to load image" : "Upload Passport Size Photo"}
              </p>
              {imageError && (previewUrl || profilePhoto) && (
                <p className="text-xs text-red-500 mt-1">
                  Check image URL
                </p>
              )}
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="profile-photo"
          />
          <Label 
            htmlFor="profile-photo" 
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {isUploading ? "Uploading..." : profilePhoto ? "Change Photo" : "Choose Photo"}
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="usn">University Seat Number (USN) *</Label>
          <Input
            id="usn"
            {...register("usn")}
            placeholder="2SD22CS001"
            className="uppercase"
          />
          {errors.usn && (
            <p className="text-sm text-red-600">{errors.usn.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Enter 10-digit phone number"
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
          <Input
            id="alternatePhone"
            {...register("alternatePhone")}
            placeholder="Enter alternate phone number"
          />
          {errors.alternatePhone && (
            <p className="text-sm text-red-600">{errors.alternatePhone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <DatePicker
            date={dateOfBirth}
            onSelect={(date) => setValue("dateOfBirth", date)}
            placeholder="Pick your date of birth"
            disableFuture={true}
            fromYear={1950}
            toYear={new Date().getFullYear() - 15} // Minimum age of 15
            captionLayout="dropdown"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={(value) => setValue("gender", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
              <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select onValueChange={(value) => setValue("bloodGroup", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? "Saving..." : "Next"}
        </Button>
      </div>
    </form>
  )
}
