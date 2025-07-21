import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadToR2, generateFilename, getFileTypeCategory } from "@/lib/r2-storage"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!type) {
      return NextResponse.json({ error: "Upload type is required" }, { status: 400 })
    }

    // Validate file type based on upload type
    const allowedTypes: Record<string, string[]> = {
      "profile-photo": ["image/jpeg", "image/png", "image/webp"],
      "resume": ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "tenthMarksCard": ["application/pdf", "image/jpeg", "image/png"],
      "twelfthMarksCard": ["application/pdf", "image/jpeg", "image/png"],
      "diplomaMarksCard": ["application/pdf", "image/jpeg", "image/png"],
      "degreeMarksCard": ["application/pdf", "image/jpeg", "image/png"],
      "transcript": ["application/pdf"],
      "passport": ["application/pdf", "image/jpeg", "image/png"],
      "aadharCard": ["application/pdf", "image/jpeg", "image/png"],
      "panCard": ["application/pdf", "image/jpeg", "image/png"],
    }

    if (!allowedTypes[type]?.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type for ${type}. Allowed: ${allowedTypes[type]?.join(", ")}` },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit for documents, 5MB for images)
    const fileTypeCategory = getFileTypeCategory(type)
    const maxSize = fileTypeCategory === "image" ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    
    if (file.size > maxSize) {
      const sizeLimit = fileTypeCategory === "image" ? "5MB" : "10MB"
      return NextResponse.json(
        { error: `File size must be less than ${sizeLimit}` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate proper filename with user ID and type
    const filename = generateFilename(session.user.id, type, file.name)

    // Upload to Cloudflare R2
    const uploadResult = await uploadToR2(
      buffer,
      filename,
      file.type,
      session.user.id
    )

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      key: uploadResult.key,
      filename: filename.split("/").pop(), // Just the filename without path
      type,
      message: "File uploaded successfully to Cloudflare R2"
    })

  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
