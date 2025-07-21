# Cloudflare R2 Setup Guide

This guide will help you set up Cloudflare R2 storage for file uploads in the placement management system.

## Prerequisites

1. A Cloudflare account
2. Access to Cloudflare R2 (might require Workers Paid plan)

## Step 1: Create an R2 Bucket

1. Log in to your Cloudflare dashboard
2. Navigate to **R2 Object Storage**
3. Click **Create bucket**
4. Choose a bucket name (e.g., `placement-documents`)
5. Select your preferred location
6. Click **Create bucket**

## Step 2: Generate API Tokens

1. In your Cloudflare dashboard, go to **My Profile** > **API Tokens**
2. Click **Create Token**
3. Use the **Custom token** template
4. Configure the following permissions:
   - **Account** - `Cloudflare R2:Edit`
   - **Zone Resources** - Include `All zones` (if using custom domain)
   - **Account Resources** - Include your account

## Step 3: Get R2 Credentials

1. In your R2 dashboard, click **Manage R2 API tokens**
2. Click **Create API token**
3. Enter a descriptive name
4. Set permissions to **Admin Read & Write**
5. Copy the generated:
   - Access Key ID
   - Secret Access Key
   - Account ID

## Step 4: Configure Custom Domain (Optional but Recommended)

1. In your R2 bucket settings, go to **Settings** > **Custom Domains**
2. Click **Connect Domain**
3. Enter your domain (e.g., `files.yourdomain.com`)
4. Follow the DNS setup instructions
5. Wait for SSL certificate provisioning

## Step 5: Update Environment Variables

Update your `.env` file with the following variables:

```env
# Cloudflare R2 Storage
CLOUDFLARE_R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key_id"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_access_key"
CLOUDFLARE_R2_BUCKET_NAME="placement-documents"
CLOUDFLARE_R2_PUBLIC_DOMAIN="https://files.yourdomain.com"
```

Replace the values with your actual credentials:
- `your-account-id`: Your Cloudflare account ID
- `your_access_key_id`: The Access Key ID from Step 3
- `your_secret_access_key`: The Secret Access Key from Step 3
- `placement-documents`: Your bucket name
- `https://files.yourdomain.com`: Your custom domain (or use the default R2 URL)

## Step 6: Test the Setup

1. Restart your development server
2. Try uploading a profile photo or document
3. Check your R2 bucket to verify files are being uploaded

## File Organization

Files are organized in R2 with the following structure:
```
users/
  ├── {userId}/
  │   ├── profile-photo/
  │   │   └── profile-photo-{timestamp}.{ext}
  │   ├── resume/
  │   │   └── resume-{timestamp}.{ext}
  │   ├── tenth-marks-card/
  │   │   └── tenth-marks-card-{timestamp}.{ext}
  │   └── ... (other document types)
```

## Security Features

- ✅ User-specific file paths prevent unauthorized access
- ✅ File type validation based on upload type
- ✅ File size limits (5MB for images, 10MB for documents)
- ✅ Secure deletion with ownership verification
- ✅ Metadata tracking (user ID, upload timestamp)

## Cost Considerations

Cloudflare R2 pricing (as of 2024):
- **Storage**: $0.015 per GB per month
- **Class A operations** (write/list): $4.50 per million
- **Class B operations** (read): $0.36 per million
- **No egress fees** when accessed via Cloudflare

## Troubleshooting

### Common Issues:

1. **Access Denied Error**
   - Verify your API tokens have correct permissions
   - Check that the account ID in the endpoint URL is correct

2. **Bucket Not Found**
   - Ensure the bucket name in environment variables matches exactly
   - Verify the bucket exists in your Cloudflare R2 dashboard

3. **SSL/TLS Errors**
   - If using custom domain, ensure SSL certificate is active
   - Check that DNS records are properly configured

4. **File Upload Fails**
   - Check browser console for specific error messages
   - Verify file type and size limits
   - Ensure all environment variables are set correctly

## Development vs Production

### Development
- Use the default R2 endpoint URLs
- Test with smaller file sizes
- Monitor uploads in R2 dashboard

### Production
- Use custom domains for better branding
- Set up CDN caching if needed
- Monitor storage usage and costs
- Implement backup strategies if required

## Support

For issues with Cloudflare R2 setup, refer to:
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 API Documentation](https://developers.cloudflare.com/r2/api/)
- Cloudflare Community Forum
