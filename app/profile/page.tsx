import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileCompletion } from "@/components/profile-completion"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Check if user has a complete profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id }
  })

  // If profile is already complete, redirect to dashboard
  if (profile?.isComplete) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileCompletion />
    </div>
  )
}
