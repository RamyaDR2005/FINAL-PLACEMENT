"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import { toast } from "sonner"
import { DocumentsInfo } from "@/types/profile"

const documentsInfoSchema = z.object({
  skills: z.array(z.string()).min(1, "Please add at least one skill"),
  certifications: z.array(z.string()),
  achievements: z.array(z.string()),
  hobbies: z.array(z.string()),
  languages: z.array(z.string()).min(1, "Please add at least one language"),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  leetcode: z.string().url().optional().or(z.literal("")),
  codechef: z.string().url().optional().or(z.literal("")),
  codeforces: z.string().url().optional().or(z.literal("")),
  hackerrank: z.string().url().optional().or(z.literal("")),
  expectedSalary: z.number().min(0).optional(),
  preferredLocations: z.array(z.string()).min(1, "Please add at least one preferred location"),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"]).optional(),
  workMode: z.enum(["OFFICE", "REMOTE", "HYBRID", "FLEXIBLE"]).optional(),
})

type DocumentsInfoForm = z.infer<typeof documentsInfoSchema>

interface DocumentsInfoStepProps {
  data: Partial<DocumentsInfo>
  onNext: (data: Partial<DocumentsInfo>) => Promise<void>
  onPrevious: () => void
  isLoading: boolean
}

export function DocumentsInfoStep({ data, onNext, onPrevious, isLoading }: DocumentsInfoStepProps) {
  const [uploads, setUploads] = useState({
    resume: data.resume || null,
    tenthMarksCard: data.tenthMarksCard || null,
    twelfthMarksCard: data.twelfthMarksCard || null,
    diplomaMarksCard: data.diplomaMarksCard || null,
  })
  const [isUploading, setIsUploading] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<DocumentsInfoForm>({
    resolver: zodResolver(documentsInfoSchema),
    defaultValues: {
      skills: data.skills || [],
      certifications: data.certifications || [],
      achievements: data.achievements || [],
      hobbies: data.hobbies || [],
      languages: data.languages || ["English"],
      linkedin: data.linkedin || "",
      github: data.github || "",
      portfolio: data.portfolio || "",
      leetcode: data.leetcode || "",
      codechef: data.codechef || "",
      codeforces: data.codeforces || "",
      hackerrank: data.hackerrank || "",
      expectedSalary: data.expectedSalary || undefined,
      preferredLocations: data.preferredLocations || [],
      jobType: data.jobType || undefined,
      workMode: data.workMode || undefined,
    }
  })

  const skills = watch("skills")
  const certifications = watch("certifications")
  const achievements = watch("achievements")
  const hobbies = watch("hobbies")
  const languages = watch("languages")
  const preferredLocations = watch("preferredLocations")

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = {
      resume: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      marksCard: ["application/pdf", "image/jpeg", "image/png"]
    }

    const fileTypeGroup = type === "resume" ? "resume" : "marksCard"
    if (!allowedTypes[fileTypeGroup].includes(file.type)) {
      toast.error(`Please upload a valid file type for ${type}`)
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size must be less than 5MB")
      return
    }

    setIsUploading(type)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setUploads(prev => ({ ...prev, [type]: data.url }))
        toast.success(`${type} uploaded successfully!`)
      } else {
        toast.error(`Failed to upload ${type}`)
      }
    } catch (error) {
      toast.error("Something went wrong uploading the file")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(null)
    }
  }

  const addArrayItem = (field: keyof DocumentsInfoForm, value: string) => {
    if (!value.trim()) return
    
    const currentArray = watch(field) as string[]
    if (!currentArray.includes(value)) {
      setValue(field, [...currentArray, value])
    }
  }

  const removeArrayItem = (field: keyof DocumentsInfoForm, index: number) => {
    const currentArray = watch(field) as string[]
    setValue(field, currentArray.filter((_, i) => i !== index))
  }

  const ArrayInput = ({ field, placeholder, label }: { field: keyof DocumentsInfoForm, placeholder: string, label: string }) => {
    const [inputValue, setInputValue] = useState("")
    const currentArray = watch(field) as string[]

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addArrayItem(field, inputValue)
                setInputValue("")
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => {
              addArrayItem(field, inputValue)
              setInputValue("")
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentArray.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeArrayItem(field, index)}
              />
            </Badge>
          ))}
        </div>
        {field === "skills" && errors.skills && (
          <p className="text-sm text-red-600">{errors.skills.message}</p>
        )}
        {field === "languages" && errors.languages && (
          <p className="text-sm text-red-600">{errors.languages.message}</p>
        )}
        {field === "preferredLocations" && errors.preferredLocations && (
          <p className="text-sm text-red-600">{errors.preferredLocations.message}</p>
        )}
      </div>
    )
  }

  const onSubmit = async (formData: DocumentsInfoForm) => {
    await onNext({
      ...formData,
      resume: uploads.resume || undefined,
      tenthMarksCard: uploads.tenthMarksCard || undefined,
      twelfthMarksCard: uploads.twelfthMarksCard || undefined,
      diplomaMarksCard: uploads.diplomaMarksCard || undefined,
      linkedin: formData.linkedin || undefined,
      github: formData.github || undefined,
      portfolio: formData.portfolio || undefined,
      leetcode: formData.leetcode || undefined,
      codechef: formData.codechef || undefined,
      codeforces: formData.codeforces || undefined,
      hackerrank: formData.hackerrank || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Document Uploads */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Document Uploads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries({
            resume: "Resume (PDF/DOC)",
            tenthMarksCard: "10th Marks Card (PDF/Image)",
            twelfthMarksCard: "12th Marks Card (PDF/Image)",
            diplomaMarksCard: "Diploma Marks Card (PDF/Image)"
          }).map(([type, label]) => (
            <div key={type} className="space-y-2">
              <Label>{label} {type === "resume" ? "*" : ""}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {uploads[type as keyof typeof uploads] ? (
                  <div className="text-green-600">
                    <p className="text-sm">✓ File uploaded successfully</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setUploads(prev => ({ ...prev, [type]: null }))}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept={type === "resume" ? ".pdf,.doc,.docx" : ".pdf,.jpg,.jpeg,.png"}
                      onChange={(e) => handleFileUpload(e, type)}
                      className="hidden"
                      id={`upload-${type}`}
                    />
                    <Label
                      htmlFor={`upload-${type}`}
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      {isUploading === type ? "Uploading..." : "Choose File"}
                    </Label>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills and Technologies */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Skills & Technologies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ArrayInput field="skills" placeholder="e.g., JavaScript, Python, React" label="Technical Skills *" />
          <ArrayInput field="languages" placeholder="e.g., English, Hindi, Kannada" label="Languages *" />
          <ArrayInput field="certifications" placeholder="e.g., AWS Cloud Practitioner" label="Certifications" />
          <ArrayInput field="achievements" placeholder="e.g., Hackathon Winner, Dean's List" label="Achievements" />
          <ArrayInput field="hobbies" placeholder="e.g., Photography, Reading, Sports" label="Hobbies & Interests" />
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Social & Professional Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              {...register("linkedin")}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {errors.linkedin && (
              <p className="text-sm text-red-600">{errors.linkedin.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub Profile</Label>
            <Input
              id="github"
              {...register("github")}
              placeholder="https://github.com/yourusername"
            />
            {errors.github && (
              <p className="text-sm text-red-600">{errors.github.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio Website</Label>
            <Input
              id="portfolio"
              {...register("portfolio")}
              placeholder="https://yourportfolio.com"
            />
            {errors.portfolio && (
              <p className="text-sm text-red-600">{errors.portfolio.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="leetcode">LeetCode Profile</Label>
            <Input
              id="leetcode"
              {...register("leetcode")}
              placeholder="https://leetcode.com/yourusername"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codechef">CodeChef Profile</Label>
            <Input
              id="codechef"
              {...register("codechef")}
              placeholder="https://codechef.com/users/yourusername"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codeforces">Codeforces Profile</Label>
            <Input
              id="codeforces"
              {...register("codeforces")}
              placeholder="https://codeforces.com/profile/yourusername"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hackerrank">HackerRank Profile</Label>
            <Input
              id="hackerrank"
              {...register("hackerrank")}
              placeholder="https://hackerrank.com/yourusername"
            />
          </div>
        </div>
      </div>

      {/* Placement Preferences */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Placement Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="expectedSalary">Expected Salary (LPA)</Label>
            <Input
              id="expectedSalary"
              type="number"
              step="0.1"
              min="0"
              {...register("expectedSalary", { valueAsNumber: true })}
              placeholder="e.g., 6.5"
            />
          </div>

          <ArrayInput field="preferredLocations" placeholder="e.g., Bangalore, Mumbai, Delhi" label="Preferred Locations *" />

          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select onValueChange={(value) => setValue("jobType", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="PART_TIME">Part Time</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workMode">Work Mode</Label>
            <Select onValueChange={(value) => setValue("workMode", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OFFICE">Office</SelectItem>
                <SelectItem value="REMOTE">Remote</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
                <SelectItem value="FLEXIBLE">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[140px]">
          {isLoading ? "Completing..." : "Complete Profile"}
        </Button>
      </div>
    </form>
  )
}
