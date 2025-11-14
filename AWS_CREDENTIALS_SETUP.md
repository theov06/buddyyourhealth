# AWS Credentials Setup Guide

## Quick Overview
You need 3 things from AWS:
1. **AWS_REGION** (e.g., `us-east-1`)
2. **AWS_ACCESS_KEY_ID** (e.g., `AKIAIOSFODNN7EXAMPLE`)
3. **AWS_SECRET_ACCESS_KEY** (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)

---

## Step-by-Step Instructions

### Step 1: Sign in to AWS Console

1. Go to https://console.aws.amazon.com/
2. Sign in with your AWS account
3. If you don't have an account, create one at https://aws.amazon.com/

---

### Step 2: Create an IAM User

1. **Go to IAM Service**
   - In the AWS Console search bar, type "IAM"
   - Click on "IAM" (Identity and Access Management)

2. **Create New User**
   - Click "Users" in the left sidebar
   - Click "Create user" button
   - Enter username: `bedrock-genai-user`
   - Click "Next"

3. **Set Permissions**
   - Select "Attach policies directly"
   - Search for and select these policies:
     - ✅ `AmazonBedrockFullAccess` (for Bedrock access)
   - Click "Next"

4. **Review and Create**
   - Review the settings
   - Click "Create user"

---

### Step 3: Create Access Keys

1. **Open the User**
   - Click on the user you just created (`bedrock-genai-user`)

2. **Create Access Key**
   - Click the "Security credentials" tab
   - Scroll down to "Access keys" section
   - Click "Create access key"

3. **Select Use Case**
   - Choose "Application running outside AWS"
   - Check the confirmation box
   - Click "Next"

4. **Add Description (Optional)**
   - Description: "GenAI Chat Application"
   - Click "Create access key"

5. **IMPORTANT: Save Your Credentials**
   - You'll see:
     - **Access key ID**: `AKIAIOSFODNN7EXAMPLE`
     - **Secret access key**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
   - ⚠️ **Copy these NOW** - you won't be able to see the secret key again!
   - Click "Download .csv file" to save them
   - Click "Done"

---

### Step 4: Enable Amazon Bedrock Access

1. **Go to Amazon Bedrock**
   - In the AWS Console search bar, type "Bedrock"
   - Click on "Amazon Bedrock"

2. **Request Model Access**
   - Click "Model access" in the left sidebar
   - Click "Manage model access" button (orange button)

3. **Select Models**
   - Find "Amazon" section
   - Check the box for:
     - ✅ **Amazon Nova Micro** (recommended - cheapest)
     - ✅ **Amazon Nova Lite** (optional - more capable)
   - Scroll down and click "Request model access"

4. **Wait for Approval**
   - Status will change from "In progress" to "Access granted"
   - Usually takes a few seconds
   - Refresh the page if needed

---

### Step 5: Add Credentials to Your Project

1. **Open your project's backend/.env file**
   ```bash
   # Navigate to your project
   cd /path/to/buddyyourhealth-1/backend
   
   # Open .env file in your editor
   code .env
   # or
   nano .env
   ```

2. **Add your AWS credentials**
   Replace the placeholder values with your actual credentials:
   ```env
   # AWS Bedrock Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
   AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```

3. **Save the file**
   - Press `Ctrl+S` (or `Cmd+S` on Mac)
   - Close the editor

---

### Step 6: Verify Setup

1. **Restart your backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the GenAI chat**
   - Open your app in browser
   - Sign in to your account
   - Click "ACTIVATE" button
   - Click "Generative AI" button
   - Try sending a message like "Hello, how are you?"

3. **Check for errors**
   - If you see a response from the AI, it's working! ✅
   - If you see an error, check the backend console logs

---

## Troubleshooting

### Error: "The security token included in the request is invalid"
**Solution**: Your AWS credentials are incorrect
- Double-check the Access Key ID and Secret Access Key
- Make sure there are no extra spaces
- Regenerate the access keys if needed

### Error: "User is not authorized to perform: bedrock:InvokeModel"
**Solution**: Your IAM user doesn't have Bedrock permissions
- Go back to IAM → Users → Your User
- Add the `AmazonBedrockFullAccess` policy

### Error: "Could not resolve model"
**Solution**: You don't have access to the model
- Go to Amazon Bedrock → Model access
- Request access to Amazon Nova Micro
- Wait for approval (usually instant)

### Error: "Region not supported"
**Solution**: Amazon Bedrock is not available in your region
- Change `AWS_REGION` to `us-east-1` (Virginia)
- Or try: `us-west-2` (Oregon)

---

## Security Best Practices

### ✅ DO:
- Keep your `.env` file in `.gitignore` (already done)
- Use IAM users with minimal permissions
- Rotate access keys regularly (every 90 days)
- Monitor AWS costs in the billing dashboard
- Delete unused access keys

### ❌ DON'T:
- Never commit `.env` file to git
- Never share your secret access key
- Don't use root account credentials
- Don't give more permissions than needed

---

## Cost Management

### Free Tier (First 2 Months)
Amazon Bedrock offers free tier for new customers:
- **Amazon Nova Micro**: 10M input tokens, 3M output tokens per month

### After Free Tier
- **Amazon Nova Micro**: ~$0.000035 per 1K input tokens
- Typical conversation: ~$0.001 - $0.005
- 1000 conversations/month: ~$1 - $5

### Monitor Costs
1. Go to AWS Console → Billing Dashboard
2. Set up billing alerts:
   - Click "Billing preferences"
   - Enable "Receive Billing Alerts"
   - Set alert threshold (e.g., $5)

---

## Alternative: Use AWS CLI (Advanced)

If you prefer using the command line:

```bash
# Install AWS CLI
# macOS
brew install awscli

# Windows
# Download from: https://aws.amazon.com/cli/

# Configure credentials
aws configure

# Enter when prompted:
# AWS Access Key ID: [your access key]
# AWS Secret Access Key: [your secret key]
# Default region name: us-east-1
# Default output format: json
```

This will create credentials at `~/.aws/credentials` that your app can use automatically.

---

## Quick Reference

### Your .env file should look like:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/buddy-your-health
JWT_SECRET=your-super-secret-jwt-key-for-development-only

# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### AWS Console Links
- **IAM Users**: https://console.aws.amazon.com/iam/home#/users
- **Bedrock Model Access**: https://console.aws.amazon.com/bedrock/home#/modelaccess
- **Billing Dashboard**: https://console.aws.amazon.com/billing/home

---

## Need Help?

1. **AWS Documentation**: https://docs.aws.amazon.com/bedrock/
2. **AWS Support**: https://console.aws.amazon.com/support/
3. **Check backend logs**: Look for error messages in your terminal

---

**Once you've added your credentials, restart the backend and test the GenAI chat!** 🚀
