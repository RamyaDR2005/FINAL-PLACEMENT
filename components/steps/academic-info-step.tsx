"use client"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { YearPicker } from "@/components/ui/date-picker"
import { ArrowLeft, GraduationCap, School, BookOpen, Award, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { AcademicInfo } from "@/types/profile"

const academicInfoSchema = z.object({
  department: z.string().min(2, "Department selection is required"),
  course: z.string().min(2, "Course selection is required"),
  semester: z.number().min(1, "Semester must be between 1-8").max(8, "Semester must be between 1-8"),
  year: z.number().min(1, "Year must be between 1-4").max(4, "Year must be between 1-4"),
  cgpa: z.number().min(0, "CGPA must be between 0-10").max(10, "CGPA must be between 0-10"),
  
  // Previous Education
  tenthBoard: z.string().min(2, "10th board selection is required"),
  tenthMarks: z.number().min(35, "Minimum 35% required").max(100, "Maximum 100% allowed"),
  tenthYear: z.number().min(2000, "Year must be after 2000").max(new Date().getFullYear(), "Future year not allowed"),
  
  // Education Path Selection (Either PUC or Diploma - Required)
  educationPath: z.enum(["puc", "diploma"], {
    message: "Please select either PUC or Diploma as your education path"
  }),
  
  // 12th/PUC (for direct entry students)
  twelfthBoard: z.string().optional(),
  twelfthMarks: z.number().min(0).max(100).optional(),
  twelfthYear: z.number().min(2000).max(new Date().getFullYear()).optional(),
  
  // Diploma (for lateral entry students)
  diplomaStream: z.string().optional(),
  diplomaMarks: z.number().min(0).max(100).optional(),
  diplomaYear: z.number().min(2000).max(new Date().getFullYear()).optional(),
}).refine((data) => {
  // If PUC is selected, require PUC fields
  if (data.educationPath === "puc") {
    return data.twelfthBoard && data.twelfthMarks && data.twelfthYear
  }
  // If Diploma is selected, require Diploma fields
  if (data.educationPath === "diploma") {
    return data.diplomaStream && data.diplomaMarks && data.diplomaYear
  }
  return false
}, {
  message: "Please fill all required fields for your selected education path",
  path: ["educationPath"]
})

type AcademicInfoForm = z.infer<typeof academicInfoSchema>

interface AcademicInfoStepProps {
  data: Partial<AcademicInfo>
  onNext: (data: Partial<AcademicInfo>) => Promise<void>
  onPrevious: () => void
  isLoading: boolean
}

export function AcademicInfoStep({ data, onNext, onPrevious, isLoading }: AcademicInfoStepProps) {
  // Determine the education path from existing data
  const initialEducationPath = data.hasCompletedDiploma ? "diploma" : "puc"
  const [educationPath, setEducationPath] = useState<"puc" | "diploma">(initialEducationPath)
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields }
  } = useForm<AcademicInfoForm>({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: {
      department: data.department || "",
      course: data.course || "",
      semester: data.semester || 1,
      year: data.year || 1,
      cgpa: data.cgpa || 0,
      tenthBoard: data.tenthBoard || "",
      tenthMarks: data.tenthMarks || 0,
      tenthYear: data.tenthYear || new Date().getFullYear(),
      educationPath: initialEducationPath,
      twelfthBoard: data.twelfthBoard || "",
      twelfthMarks: data.twelfthMarks || 0,
      twelfthYear: data.twelfthYear || new Date().getFullYear(),
      diplomaStream: data.diplomaStream || "",
      diplomaMarks: data.diplomaMarks || 0,
      diplomaYear: data.diplomaYear || new Date().getFullYear(),
    }
  })

  const onSubmit = async (formData: AcademicInfoForm) => {
    // Convert to the format expected by the parent component
    // Only include fields that exist in the database schema
    let finalSubmissionData: any = {
      // Common fields that always exist in schema
      department: formData.department,
      course: formData.course,
      semester: formData.semester,
      year: formData.year,
      cgpa: formData.cgpa,
      tenthBoard: formData.tenthBoard,
      tenthMarks: formData.tenthMarks,
      tenthYear: formData.tenthYear,
    }
    
    // Only include education-path specific fields if they exist in schema and user selected that path
    if (formData.educationPath === "puc") {
      // Add 12th/PUC fields only - these exist in the schema
      finalSubmissionData.twelfthBoard = formData.twelfthBoard
      finalSubmissionData.twelfthMarks = formData.twelfthMarks
      finalSubmissionData.twelfthYear = formData.twelfthYear
    } else if (formData.educationPath === "diploma") {
      // Add diploma fields - all three fields now exist in schema
      finalSubmissionData.diplomaStream = formData.diplomaStream
      finalSubmissionData.diplomaMarks = formData.diplomaMarks
      finalSubmissionData.diplomaYear = formData.diplomaYear
    }
    
    await onNext(finalSubmissionData)
  }

  // Helper function to check if a field has error
  const hasError = (fieldName: keyof AcademicInfoForm) => !!errors[fieldName]
  const isFieldTouched = (fieldName: keyof AcademicInfoForm) => !!touchedFields[fieldName]
  const isFieldValid = (fieldName: keyof AcademicInfoForm) => isFieldTouched(fieldName) && !hasError(fieldName)

  // Handle education path changes
  const handleEducationPathChange = (newPath: "puc" | "diploma") => {
    setEducationPath(newPath)
    setValue("educationPath", newPath)
    
    // Clear fields from the non-selected path
    if (newPath === "puc") {
      setValue("diplomaStream", "")
      setValue("diplomaMarks", undefined)
      setValue("diplomaYear", undefined)
    } else {
      setValue("twelfthBoard", "")
      setValue("twelfthMarks", undefined)
      setValue("twelfthYear", undefined)
    }
  }

  // Watch form values for dynamic updates
  const watchedCgpa = watch("cgpa")
  const watchedSemester = watch("semester")

  // Automatically calculate year based on semester
  React.useEffect(() => {
    if (watchedSemester) {
      const calculatedYear = Math.ceil(watchedSemester / 2)
      setValue("year", calculatedYear)
    }
  }, [watchedSemester, setValue])

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Academic Information</h2>
        </div>
        <p className="text-muted-foreground">
          Please provide your academic details to complete your profile
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Current Academic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Current Academic Information</span>
            </CardTitle>
            <CardDescription>
              Information about your current college and academic status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Department</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("department") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("department", value)}>
                  <SelectTrigger className={cn(
                    "h-9 w-full",
                    hasError("department") && "border-red-500 focus:ring-red-500",
                    isFieldValid("department") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science Engineering">Computer Science Engineering</SelectItem>
                    <SelectItem value="Information Science Engineering">Information Science Engineering</SelectItem>
                    <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                    <SelectItem value="Electrical & Electronics">Electrical & Electronics</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Artificial Intelligence & Machine Learning">AI & Machine Learning</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.department.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="course" className="flex items-center space-x-1 text-sm font-medium">
                  <span>Course</span>
                  <span className="text-red-500">*</span>
                  {isFieldValid("course") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select onValueChange={(value) => setValue("course", value)}>
                  <SelectTrigger className={cn(
                    "h-9 w-full",
                    hasError("course") && "border-red-500 focus:ring-red-500",
                    isFieldValid("course") && "border-green-500"
                  )}>
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B.E">Bachelor of Engineering (B.E)</SelectItem>
                    <SelectItem value="B.Tech">Bachelor of Technology (B.Tech)</SelectItem>
                    <SelectItem value="M.Tech">Master of Technology (M.Tech)</SelectItem>
                    <SelectItem value="MCA">Master of Computer Applications (MCA)</SelectItem>
                    <SelectItem value="MBA">Master of Business Administration (MBA)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.course && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.course.message}</span>
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Academic Performance */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2 text-sm">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Current Academic Performance</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Current Semester</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("semester") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Select onValueChange={(value) => setValue("semester", parseInt(value))}>
                    <SelectTrigger className={cn(
                      "h-9 w-full",
                      hasError("semester") && "border-red-500 focus:ring-red-500",
                      isFieldValid("semester") && "border-green-500"
                    )}>
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.semester && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.semester.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium">
                    <span>Current Year</span>
                  </Label>
                  <div className="h-9 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center text-sm text-gray-600">
                    {watchedSemester ? `${Math.ceil(watchedSemester / 2)}${Math.ceil(watchedSemester / 2) === 1 ? 'st' : Math.ceil(watchedSemester / 2) === 2 ? 'nd' : Math.ceil(watchedSemester / 2) === 3 ? 'rd' : 'th'} Year` : 'Select semester first'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cgpa" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Current CGPA</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("cgpa") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    {...register("cgpa", { valueAsNumber: true })}
                    placeholder="8.5"
                    className={cn(
                      "h-9",
                      hasError("cgpa") && "border-red-500 focus-visible:ring-red-500",
                      isFieldValid("cgpa") && "border-green-500"
                    )}
                  />
                  {errors.cgpa && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.cgpa.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Education Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <School className="w-5 h-5 text-green-600" />
              <span>Previous Education</span>
            </CardTitle>
            <CardDescription>
              Information about your previous academic qualifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 10th Standard - Always Required */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2 text-sm">
                <span>10th Standard / SSLC</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenthBoard" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Board</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("tenthBoard") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Select onValueChange={(value) => setValue("tenthBoard", value)}>
                    <SelectTrigger className={cn(
                      "h-9 w-full",
                      hasError("tenthBoard") && "border-red-500 focus:ring-red-500",
                      isFieldValid("tenthBoard") && "border-green-500"
                    )}>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">
                        <div className="flex items-center space-x-2">
                          <span>🏛️</span>
                          <span>CBSE</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ICSE">
                        <div className="flex items-center space-x-2">
                          <span>🏛️</span>
                          <span>ICSE</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Karnataka State Board">
                        <div className="flex items-center space-x-2">
                          <span>🏛️</span>
                          <span>Karnataka State Board</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Other State Board">
                        <div className="flex items-center space-x-2">
                          <span>🏛️</span>
                          <span>Other State Board</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tenthBoard && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.tenthBoard.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenthMarks" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Percentage</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("tenthMarks") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <Input
                    id="tenthMarks"
                    type="number"
                    step="0.01"
                    min="35"
                    max="100"
                    {...register("tenthMarks", { valueAsNumber: true })}
                    placeholder="85.5"
                    className={cn(
                      "h-9",
                      hasError("tenthMarks") && "border-red-500 focus-visible:ring-red-500",
                      isFieldValid("tenthMarks") && "border-green-500"
                    )}
                  />
                  {errors.tenthMarks && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.tenthMarks.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenthYear" className="flex items-center space-x-1 text-sm font-medium">
                    <span>Year of Passing</span>
                    <span className="text-red-500">*</span>
                    {isFieldValid("tenthYear") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Label>
                  <YearPicker
                    year={watch("tenthYear")}
                    onSelect={(year) => setValue("tenthYear", year || new Date().getFullYear())}
                    placeholder="Select year of passing"
                    fromYear={2000}
                    toYear={new Date().getFullYear()}
                    className={cn(
                      "h-9",
                      hasError("tenthYear") && "border-red-500 focus:ring-red-500",
                      isFieldValid("tenthYear") && "border-green-500"
                    )}
                  />
                  {errors.tenthYear && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.tenthYear.message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Education Path Selection */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2 text-sm">
                <School className="w-4 h-4 text-blue-600" />
                <span>Education Path Selection</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Please select your education path after 10th standard. You must choose either PUC or Diploma.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {/* PUC Option */}
                <div 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    educationPath === "puc" 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => handleEducationPathChange("puc")}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="educationPath"
                      value="puc"
                      checked={educationPath === "puc"}
                      onChange={() => handleEducationPathChange("puc")}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">12th Standard / PUC</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        For students who completed 12th/PUC and joined directly
                      </p>
                    </div>
                  </div>
                </div>

                {/* Diploma Option */}
                <div 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    educationPath === "diploma" 
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => handleEducationPathChange("diploma")}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="educationPath"
                      value="diploma"
                      checked={educationPath === "diploma"}
                      onChange={() => handleEducationPathChange("diploma")}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">Diploma</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        For students who completed diploma and joined via lateral entry
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {errors.educationPath && (
                <p className="text-sm text-red-600 flex items-center space-x-1 mb-3">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.educationPath.message}</span>
                </p>
              )}
            </div>

            <Separator />

            {/* 12th Standard Details - Show only when PUC is selected */}
            {educationPath === "puc" && (
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2 text-sm">
                  <Badge variant="default" className="text-xs">Required</Badge>
                  <span>12th Standard / PUC Details</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="space-y-2">
                    <Label htmlFor="twelfthBoard" className="flex items-center space-x-1 text-sm font-medium">
                      <span>Board</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("twelfthBoard") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Select onValueChange={(value) => setValue("twelfthBoard", value)}>
                      <SelectTrigger className={cn(
                        "h-9 w-full",
                        hasError("twelfthBoard") && "border-red-500 focus:ring-red-500",
                        isFieldValid("twelfthBoard") && "border-green-500"
                      )}>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                        <SelectItem value="Karnataka PUC">Karnataka PUC</SelectItem>
                        <SelectItem value="Other State Board">Other State Board</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.twelfthBoard && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.twelfthBoard.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twelfthMarks" className="flex items-center space-x-1 text-sm font-medium">
                      <span>Percentage</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("twelfthMarks") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Input
                      id="twelfthMarks"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      {...register("twelfthMarks", { valueAsNumber: true })}
                      placeholder="85.5"
                      className={cn(
                        "h-9",
                        hasError("twelfthMarks") && "border-red-500 focus-visible:ring-red-500",
                        isFieldValid("twelfthMarks") && "border-green-500"
                      )}
                    />
                    {errors.twelfthMarks && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.twelfthMarks.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twelfthYear" className="flex items-center space-x-1 text-sm font-medium">
                      <span>Year of Passing</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("twelfthYear") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <YearPicker
                      year={watch("twelfthYear")}
                      onSelect={(year) => setValue("twelfthYear", year || new Date().getFullYear())}
                      placeholder="Select year of passing"
                      fromYear={2000}
                      toYear={new Date().getFullYear()}
                      className={cn(
                        "h-9",
                        hasError("twelfthYear") && "border-red-500 focus:ring-red-500",
                        isFieldValid("twelfthYear") && "border-green-500"
                      )}
                    />
                    {errors.twelfthYear && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.twelfthYear.message}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Diploma Details - Show only when Diploma is selected */}
            {educationPath === "diploma" && (
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2 text-sm">
                  <Badge variant="default" className="text-xs">Required</Badge>
                  <span>Diploma Details (Lateral Entry)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="space-y-2">
                    <Label htmlFor="diplomaStream" className="flex items-center space-x-1 text-sm font-medium">
                      <span>Stream/Branch</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("diplomaStream") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Input
                      id="diplomaStream"
                      {...register("diplomaStream")}
                      placeholder="e.g., Computer Science"
                      className={cn(
                        "h-9",
                        hasError("diplomaStream") && "border-red-500 focus-visible:ring-red-500",
                        isFieldValid("diplomaStream") && "border-green-500"
                      )}
                    />
                    {errors.diplomaStream && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.diplomaStream.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diplomaMarks" className="flex items-center space-x-1 text-sm font-medium">
                      <span>Percentage</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("diplomaMarks") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Input
                      id="diplomaMarks"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      {...register("diplomaMarks", { valueAsNumber: true })}
                      placeholder="85.5"
                      className={cn(
                        "h-9",
                        hasError("diplomaMarks") && "border-red-500 focus-visible:ring-red-500",
                        isFieldValid("diplomaMarks") && "border-green-500"
                      )}
                    />
                    {errors.diplomaMarks && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.diplomaMarks.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diplomaYear" className="flex items-center space-x-1 text-sm font-medium">
                      <span>Year of Passing</span>
                      <span className="text-red-500">*</span>
                      {isFieldValid("diplomaYear") && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <YearPicker
                      year={watch("diplomaYear")}
                      onSelect={(year) => setValue("diplomaYear", year || new Date().getFullYear())}
                      placeholder="Select year"
                      fromYear={2000}
                      toYear={new Date().getFullYear()}
                      className={cn(
                        "h-9",
                        hasError("diplomaYear") && "border-red-500 focus:ring-red-500",
                        isFieldValid("diplomaYear") && "border-green-500"
                      )}
                    />
                    {errors.diplomaYear && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.diplomaYear.message}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button type="button" variant="outline" onClick={onPrevious} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Step 2 of 5 - Academic Information
            </div>
            <Button type="submit" disabled={isLoading} className="min-w-[140px] flex items-center space-x-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <span>→</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
