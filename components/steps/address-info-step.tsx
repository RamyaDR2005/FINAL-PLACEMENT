"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { AddressInfo } from "@/types/profile"

const addressInfoSchema = z.object({
  currentAddress: z.string().min(10, "Current address is required"),
  currentCity: z.string().min(2, "Current city is required"),
  currentState: z.string().min(2, "Current state is required"),
  currentPincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  permanentCity: z.string().min(1, "Permanent city is required"),
  permanentState: z.string().min(1, "Permanent state is required"),
  permanentPincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  sameAsCurrent: z.boolean(),
  
  // Parent/Guardian Info
  fatherName: z.string().min(2, "Father's name is required"),
  fatherPhone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid phone number"),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(2, "Mother's name is required"),
  motherPhone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid phone number"),
  motherOccupation: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianRelation: z.string().optional(),
})

type AddressInfoForm = z.infer<typeof addressInfoSchema>

interface AddressInfoStepProps {
  data: Partial<AddressInfo>
  onNext: (data: Partial<AddressInfo>) => Promise<void>
  onPrevious: () => void
  isLoading: boolean
}

export function AddressInfoStep({ data, onNext, onPrevious, isLoading }: AddressInfoStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AddressInfoForm>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: {
      currentAddress: data.currentAddress || "",
      currentCity: data.currentCity || "",
      currentState: data.currentState || "",
      currentPincode: data.currentPincode || "",
      permanentAddress: data.permanentAddress || "",
      permanentCity: data.permanentCity || "",
      permanentState: data.permanentState || "",
      permanentPincode: data.permanentPincode || "",
      sameAsCurrent: data.sameAsCurrent || false,
      fatherName: data.fatherName || "",
      fatherPhone: data.fatherPhone || "",
      fatherOccupation: data.fatherOccupation || "",
      motherName: data.motherName || "",
      motherPhone: data.motherPhone || "",
      motherOccupation: data.motherOccupation || "",
      guardianName: data.guardianName || "",
      guardianPhone: data.guardianPhone || "",
      guardianRelation: data.guardianRelation || "",
    }
  })

  const sameAsCurrent = watch("sameAsCurrent")
  const currentAddress = watch("currentAddress")
  const currentCity = watch("currentCity")
  const currentState = watch("currentState")
  const currentPincode = watch("currentPincode")

  const handleSameAsCurrentChange = (checked: boolean) => {
    setValue("sameAsCurrent", checked)
    if (checked) {
      setValue("permanentAddress", currentAddress)
      setValue("permanentCity", currentCity)
      setValue("permanentState", currentState)
      setValue("permanentPincode", currentPincode)
    } else {
      setValue("permanentAddress", "")
      setValue("permanentCity", "")
      setValue("permanentState", "")
      setValue("permanentPincode", "")
    }
  }

  const onSubmit = async (formData: AddressInfoForm) => {
    await onNext(formData)
  }

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Current Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Address</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="currentAddress">Address *</Label>
            <Textarea
              id="currentAddress"
              {...register("currentAddress")}
              placeholder="Enter your current address"
              rows={3}
            />
            {errors.currentAddress && (
              <p className="text-sm text-red-600">{errors.currentAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentCity">City *</Label>
              <Input
                id="currentCity"
                {...register("currentCity")}
                placeholder="Enter city"
              />
              {errors.currentCity && (
                <p className="text-sm text-red-600">{errors.currentCity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentState">State *</Label>
              <Input
                id="currentState"
                {...register("currentState")}
                placeholder="Enter state"
                list="states"
              />
              <datalist id="states">
                {indianStates.map(state => (
                  <option key={state} value={state} />
                ))}
              </datalist>
              {errors.currentState && (
                <p className="text-sm text-red-600">{errors.currentState.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPincode">Pincode *</Label>
              <Input
                id="currentPincode"
                {...register("currentPincode")}
                placeholder="Enter pincode"
                maxLength={6}
              />
              {errors.currentPincode && (
                <p className="text-sm text-red-600">{errors.currentPincode.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="sameAsCurrent"
            checked={sameAsCurrent}
            onCheckedChange={handleSameAsCurrentChange}
          />
          <Label htmlFor="sameAsCurrent">
            Permanent address is same as current address
          </Label>
        </div>

        {!sameAsCurrent && (
          <>
            <h3 className="text-lg font-semibold mb-4">Permanent Address</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="permanentAddress">Address *</Label>
                <Textarea
                  id="permanentAddress"
                  {...register("permanentAddress")}
                  placeholder="Enter your permanent address"
                  rows={3}
                />
                {errors.permanentAddress && (
                  <p className="text-sm text-red-600">{errors.permanentAddress.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permanentCity">City *</Label>
                  <Input
                    id="permanentCity"
                    {...register("permanentCity")}
                    placeholder="Enter city"
                  />
                  {errors.permanentCity && (
                    <p className="text-sm text-red-600">{errors.permanentCity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanentState">State *</Label>
                  <Input
                    id="permanentState"
                    {...register("permanentState")}
                    placeholder="Enter state"
                    list="states"
                  />
                  {errors.permanentState && (
                    <p className="text-sm text-red-600">{errors.permanentState.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanentPincode">Pincode *</Label>
                  <Input
                    id="permanentPincode"
                    {...register("permanentPincode")}
                    placeholder="Enter pincode"
                    maxLength={6}
                  />
                  {errors.permanentPincode && (
                    <p className="text-sm text-red-600">{errors.permanentPincode.message}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Parent/Guardian Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Father's Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Father's Details</h4>
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name *</Label>
              <Input
                id="fatherName"
                {...register("fatherName")}
                placeholder="Enter father's name"
              />
              {errors.fatherName && (
                <p className="text-sm text-red-600">{errors.fatherName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherPhone">Father's Phone *</Label>
              <Input
                id="fatherPhone"
                {...register("fatherPhone")}
                placeholder="Enter father's phone number"
              />
              {errors.fatherPhone && (
                <p className="text-sm text-red-600">{errors.fatherPhone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherOccupation">Father's Occupation</Label>
              <Input
                id="fatherOccupation"
                {...register("fatherOccupation")}
                placeholder="Enter father's occupation"
              />
            </div>
          </div>

          {/* Mother's Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Mother's Details</h4>
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name *</Label>
              <Input
                id="motherName"
                {...register("motherName")}
                placeholder="Enter mother's name"
              />
              {errors.motherName && (
                <p className="text-sm text-red-600">{errors.motherName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherPhone">Mother's Phone *</Label>
              <Input
                id="motherPhone"
                {...register("motherPhone")}
                placeholder="Enter mother's phone number"
              />
              {errors.motherPhone && (
                <p className="text-sm text-red-600">{errors.motherPhone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherOccupation">Mother's Occupation</Label>
              <Input
                id="motherOccupation"
                {...register("motherOccupation")}
                placeholder="Enter mother's occupation"
              />
            </div>
          </div>
        </div>

        {/* Guardian Details */}
        <div className="mt-6">
          <h4 className="font-medium text-sm mb-4">Guardian Details (if applicable)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardianName">Guardian's Name</Label>
              <Input
                id="guardianName"
                {...register("guardianName")}
                placeholder="Enter guardian's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Guardian's Phone</Label>
              <Input
                id="guardianPhone"
                {...register("guardianPhone")}
                placeholder="Enter guardian's phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianRelation">Relation</Label>
              <Input
                id="guardianRelation"
                {...register("guardianRelation")}
                placeholder="e.g., Uncle, Aunt, Grandparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? "Saving..." : "Next"}
        </Button>
      </div>
    </form>
  )
}
