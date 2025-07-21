// Profile related types
export interface ProfileStep {
  id: number
  title: string
  description: string
  isComplete: boolean
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  usn: string
  phone: string
  alternatePhone?: string
  dateOfBirth?: Date
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  bloodGroup?: string
  profilePhoto?: string
}

export interface AcademicInfo {
  department: string
  course: string
  specialization?: string
  semester: number
  year: number
  cgpa: number
  percentage: number
  
  // Previous Education
  tenthBoard: string
  tenthMarks: number
  tenthYear: number
  
  // Education Path Selection (either PUC or Diploma)
  educationPath?: 'puc' | 'diploma'
  
  // 12th/PUC Education (for direct entry)
  hasCompletedTwelfth?: boolean
  twelfthBoard?: string
  twelfthMarks?: number
  twelfthYear?: number
  
  // Diploma Education (for lateral entry)
  hasCompletedDiploma?: boolean
  diplomaStream?: string
  diplomaMarks?: number
  diplomaYear?: number
}

export interface AddressInfo {
  currentAddress: string
  currentCity: string
  currentState: string
  currentPincode: string
  permanentAddress?: string
  permanentCity?: string
  permanentState?: string
  permanentPincode?: string
  sameAsCurrent: boolean
  
  // Parent/Guardian Info
  fatherName: string
  fatherPhone: string
  fatherOccupation?: string
  motherName: string
  motherPhone: string
  motherOccupation?: string
  guardianName?: string
  guardianPhone?: string
  guardianRelation?: string
}

export interface DocumentsInfo {
  resume?: string
  tenthMarksCard?: string
  twelfthMarksCard?: string
  diplomaMarksCard?: string
  allSemesterMarksCards?: string[]
  
  // Professional Info
  skills: string[]
  certifications: string[]
  projects?: ProjectInfo[]
  internships?: InternshipInfo[]
  achievements: string[]
  hobbies: string[]
  languages: string[]
  
  // Social Links
  linkedin?: string
  github?: string
  portfolio?: string
  leetcode?: string
  codechef?: string
  codeforces?: string
  hackerrank?: string
  
  // Placement Preferences
  expectedSalary?: number
  preferredLocations: string[]
  jobType?: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'FREELANCE'
  workMode?: 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FLEXIBLE'
}

export interface ProjectInfo {
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  startDate: Date
  endDate?: Date
}

export interface InternshipInfo {
  company: string
  role: string
  description: string
  startDate: Date
  endDate?: Date
  location: string
  skills: string[]
}

export interface CompleteProfile extends PersonalInfo, AcademicInfo, AddressInfo, DocumentsInfo {
  isComplete: boolean
  completionStep: number
  kycStatus: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'INCOMPLETE'
}
