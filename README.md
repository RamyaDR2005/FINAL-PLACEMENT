# 🎓 Campus Connect - SDMCET

A modern, full-stack placement management system built with Next.js 15, featuring secure authentication, email verification, and a beautiful dark theme interface.

## ✨ Features

- 🔐 **Secure Authentication** - Email/Password + Google OAuth integration
- 📧 **Email Verification** - AWS SES integration with production-ready SMTP
- 🎨 **Modern UI** - Dark theme with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design** - Mobile-first approach with beautiful animations
- 🔒 **Security First** - bcrypt hashing, CSRF protection, SQL injection prevention
- ⚡ **Performance** - Connection pooling, rate limiting, optimized email delivery
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 🚀 **TypeScript** - Full type safety throughout the application

## 🚀 Quick Start

### Prerequisites

- **Bun** (recommended) or Node.js 18+
- PostgreSQL database (Neon recommended)
- AWS SES account
- Google Cloud Console access

### 1. Clone and Install

```bash
git clone <repository-url>
cd placement-next
bun install  # Fast installation with Bun
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS SES
AWS_SES_ACCESS_KEY_ID="your-aws-access-key"
AWS_SES_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-south-1"
AWS_SES_REGION="ap-south-1"
EMAIL_FROM="noreply@yourdomain.com"

# Cloudflare R2 Storage (for file uploads)
CLOUDFLARE_R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-r2-access-key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-r2-secret-key"
CLOUDFLARE_R2_BUCKET_NAME="placement-documents"
CLOUDFLARE_R2_PUBLIC_DOMAIN="https://files.yourdomain.com"
```

### 3. Database Setup

```bash
# Run database migrations
bunx prisma migrate dev --name init

# Generate Prisma client
bunx prisma generate
```

### 4. Start Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Detailed Setup Instructions

### Database Configuration (Neon)

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project called "campus-connect"
3. Copy your database connection string
4. Update `.env` file with your `DATABASE_URL`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized JavaScript origins: `http://localhost:3000`
6. Set authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env`

### AWS SES Configuration

1. Go to AWS SES Console
2. Verify your sending domain/email address
3. Create SMTP credentials (IAM user with SES permissions)
4. Update `.env` with your AWS credentials
5. **Important**: Ensure your account is out of sandbox mode for production

### Cloudflare R2 Storage Setup

1. Create a Cloudflare account and access R2 Object Storage
2. Create a new bucket (e.g., "placement-documents")
3. Generate R2 API tokens with Admin Read & Write permissions
4. Optional: Set up a custom domain for better performance
5. Update `.env` with your R2 credentials

📖 **Detailed R2 Setup Guide**: See [docs/CLOUDFLARE_R2_SETUP.md](./docs/CLOUDFLARE_R2_SETUP.md) for complete instructions.

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add this to `.env` as `NEXTAUTH_SECRET`

## 🏗️ Project Structure

```
├── app/                  # Next.js App Router
│   ├── (auth)/          # Authentication pages
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages
│   └── globals.css      # Global styles
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions
│   ├── auth.ts         # NextAuth configuration
│   ├── email.ts        # Email service (production-ready)
│   └── prisma.ts       # Database client
├── prisma/             # Database schema and migrations
└── types/              # TypeScript type definitions
```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: JWT tokens with secure HTTP-only cookies
- **CSRF Protection**: Built-in NextAuth.js protection
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **Email Verification**: Required for account activation
- **Rate Limiting**: Email sending rate limits (10/second)
- **Environment Protection**: All secrets in environment variables

## 📧 Email System

The application includes a production-ready email system with:

- **Connection Pooling**: Reuses SMTP connections for performance
- **Rate Limiting**: Prevents overwhelming email services
- **Beautiful Templates**: Modern HTML emails matching the app design
- **Error Handling**: Comprehensive error logging and recovery
- **AWS SES Integration**: Reliable email delivery with bounce handling

### Test Email Endpoint

Visit `/api/test-email` to test your email configuration.

## 📱 User Flow

1. **Registration**: User visits `/signup` and creates account
2. **Email Verification**: User receives verification email
3. **Account Activation**: User clicks email link to verify
4. **Login**: User can login with credentials or Google OAuth
5. **Dashboard Access**: Authenticated users access placement features

## 🛠️ Development

### Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

### Database Commands

```bash
# Using Bun scripts (recommended)
bun run db:studio              # Open Prisma Studio
bun run db:migrate            # Create and apply migration
bun run db:reset              # Reset database
bun run db:generate           # Generate Prisma client
bun run db:push               # Push schema changes without migration

# Or using bunx directly
bunx prisma studio              # Open Prisma Studio
bunx prisma migrate dev         # Create and apply migration
bunx prisma migrate reset       # Reset database
bunx prisma generate           # Generate Prisma client
```

## 🚀 Deployment

### Environment Variables for Production

Ensure all environment variables are set in your production environment:
- Update `NEXTAUTH_URL` to your production domain
- Use production database URL
- Configure AWS SES for production (verify domain)
- Set secure `NEXTAUTH_SECRET`

### Recommended Platforms

- **Vercel**: Seamless Next.js deployment
- **Railway**: Full-stack deployment with database
- **AWS**: Complete AWS ecosystem integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For setup issues or questions:
- Check the troubleshooting section above
- Review the environment variable configuration
- Test email delivery with `/api/test-email`
- Verify database connection with Prisma Studio

---

Built with ❤️ for SDMCET by the Campus Connect Team
