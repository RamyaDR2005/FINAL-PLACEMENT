"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function FontShowcase() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Plus Jakarta Sans Typography</h1>
        <p className="text-muted-foreground text-lg">
          Showcasing the beautiful Plus Jakarta Sans font family
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Font Weights */}
        <Card>
          <CardHeader>
            <CardTitle>Font Weights</CardTitle>
            <CardDescription>
              Available font weights from Extra Light to Extra Bold
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="font-extralight text-lg">Extra Light (200) - The quick brown fox</div>
            <div className="font-light text-lg">Light (300) - The quick brown fox</div>
            <div className="font-normal text-lg">Normal (400) - The quick brown fox</div>
            <div className="font-medium text-lg">Medium (500) - The quick brown fox</div>
            <div className="font-semibold text-lg">Semibold (600) - The quick brown fox</div>
            <div className="font-bold text-lg">Bold (700) - The quick brown fox</div>
            <div className="font-extrabold text-lg">Extra Bold (800) - The quick brown fox</div>
          </CardContent>
        </Card>

        {/* Text Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Text Sizes</CardTitle>
            <CardDescription>
              Various text sizes from XS to 4XL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs">Extra Small (XS) - Plus Jakarta Sans</div>
            <div className="text-sm">Small (SM) - Plus Jakarta Sans</div>
            <div className="text-base">Base - Plus Jakarta Sans</div>
            <div className="text-lg">Large (LG) - Plus Jakarta Sans</div>
            <div className="text-xl">Extra Large (XL) - Plus Jakarta Sans</div>
            <div className="text-2xl">2XL - Plus Jakarta Sans</div>
            <div className="text-3xl">3XL - Plus Jakarta Sans</div>
            <div className="text-4xl">4XL - Plus Jakarta Sans</div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Real Application Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Application Examples</CardTitle>
          <CardDescription>
            How Plus Jakarta Sans appears in typical UI components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Navigation Example */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation Menu</h3>
            <div className="flex space-x-6 text-sm font-medium">
              <span className="text-primary">Dashboard</span>
              <span className="text-muted-foreground hover:text-foreground cursor-pointer">Profile</span>
              <span className="text-muted-foreground hover:text-foreground cursor-pointer">Academic Info</span>
              <span className="text-muted-foreground hover:text-foreground cursor-pointer">Documents</span>
            </div>
          </div>

          <Separator />

          {/* Form Example */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Form Elements</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">First Name *</label>
                <div className="mt-1 px-3 py-2 border rounded-md bg-background text-sm">
                  John Doe
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">University Seat Number</label>
                <div className="mt-1 px-3 py-2 border rounded-md bg-background text-sm font-mono">
                  2SD22CS001
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Card Example */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Card Content</h3>
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Academic Information</h4>
              <p className="text-sm text-muted-foreground">
                Complete your academic details to proceed with the placement process.
              </p>
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded font-medium">
                  Required
                </span>
                <span className="text-muted-foreground">Step 2 of 5</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            Font configuration details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-sm font-mono">
            <div className="text-green-400 mb-2">// Next.js Font Configuration</div>
            <div>import &#123; Plus_Jakarta_Sans &#125; from "next/font/google"</div>
            <div className="mt-2">const plusJakartaSans = Plus_Jakarta_Sans(&#123;</div>
            <div className="ml-4">variable: "--font-plus-jakarta-sans",</div>
            <div className="ml-4">subsets: ["latin"],</div>
            <div className="ml-4">display: "swap",</div>
            <div className="ml-4">weight: ["200", "300", "400", "500", "600", "700", "800"]</div>
            <div>&#125;)</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Modern geometric sans-serif</li>
                <li>• 8 font weights available</li>
                <li>• Optimized for web performance</li>
                <li>• Excellent readability</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Benefits:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Professional appearance</li>
                <li>• Great for academic applications</li>
                <li>• Consistent typography</li>
                <li>• Cross-platform compatibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
