"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker, YearPicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function DatePickerExamples() {
  const [birthDate, setBirthDate] = React.useState<Date>()
  const [graduationYear, setGraduationYear] = React.useState<number>()
  const [appointmentDate, setAppointmentDate] = React.useState<Date>()
  const [historicDate, setHistoricDate] = React.useState<Date>()

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Date Picker Examples</h1>
        <p className="text-muted-foreground mt-2">
          Various implementations of the shadcn date picker components
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date of Birth Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Date of Birth</CardTitle>
            <CardDescription>
              Date picker with past dates only and dropdown navigation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select your date of birth</Label>
              <DatePicker
                date={birthDate}
                onSelect={setBirthDate}
                placeholder="Pick your birth date"
                disableFuture={true}
                fromYear={1950}
                toYear={new Date().getFullYear() - 15}
                captionLayout="dropdown"
              />
            </div>
            {birthDate && (
              <p className="text-sm text-muted-foreground">
                Selected: {birthDate.toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Year Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Graduation Year</CardTitle>
            <CardDescription>
              Year-only picker for academic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Year of graduation</Label>
              <YearPicker
                year={graduationYear}
                onSelect={setGraduationYear}
                placeholder="Select graduation year"
                fromYear={2000}
                toYear={new Date().getFullYear()}
              />
            </div>
            {graduationYear && (
              <p className="text-sm text-muted-foreground">
                Selected: {graduationYear}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Future Appointment Date */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Date</CardTitle>
            <CardDescription>
              Date picker allowing future dates only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Schedule appointment</Label>
              <DatePicker
                date={appointmentDate}
                onSelect={setAppointmentDate}
                placeholder="Pick appointment date"
                disablePast={true}
                captionLayout="dropdown"
              />
            </div>
            {appointmentDate && (
              <p className="text-sm text-muted-foreground">
                Selected: {appointmentDate.toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Historic Date */}
        <Card>
          <CardHeader>
            <CardTitle>Historic Date</CardTitle>
            <CardDescription>
              Date picker with extended historic range
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Historical event date</Label>
              <DatePicker
                date={historicDate}
                onSelect={setHistoricDate}
                placeholder="Pick a historic date"
                fromYear={1800}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown"
              />
            </div>
            {historicDate && (
              <p className="text-sm text-muted-foreground">
                Selected: {historicDate.toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Integration Notes</CardTitle>
          <CardDescription>
            How these components are used in the placement system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Personal Information Step</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Date of birth with dropdown navigation</li>
                <li>• Age-restricted (minimum 15 years)</li>
                <li>• Past dates only</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Academic Information Step</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Year pickers for education milestones</li>
                <li>• 10th, 12th, and Diploma passing years</li>
                <li>• Range: 2000 to current year</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
