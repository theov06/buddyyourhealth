# Quick Start: Get AWS Credentials in 5 Minutes

## TL;DR - What You Need

Add these 3 lines to `backend/.env`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
```

---

## 🚀 Fast Track (5 Steps)

### 1️⃣ Go to AWS IAM
🔗 https://console.aws.amazon.com/iam/home#/users

### 2️⃣ Create User
- Click "Create user"
- Name: `bedrock-user`
- Attach policy: `AmazonBedrockFullAccess`
- Click "Create user"

### 3️⃣ Create Access Key
- Click on the user you created
- Go to "Security credentials" tab
- Click "Create access key"
- Choose "Application running outside AWS"
- Click "Create access key"
- **SAVE BOTH KEYS NOW!** ⚠️

### 4️⃣ Enable Bedrock Models
🔗 https://console.aws.amazon.com/bedrock/home#/modelaccess
- Click "Manage model access"
- Check ✅ "Amazon Nova Micro"
- Click "Request model access"
- Wait ~10 seconds for approval

### 5️⃣ Add to .env File
```bash
cd backend
nano .env
```

Add these lines:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...your key...
AWS_SECRET_ACCESS_KEY=wJal...your secret...
```

Save and restart backend:
```bash
npm run dev
```

---

## ✅ Test It Works

1. Open your app: http://localhost:3000
2. Sign in
3. Click "ACTIVATE"
4. Click "Generative AI"
5. Type: "Hello!"
6. If you get a response → **SUCCESS!** 🎉

---

## 💰 Cost

**Free Tier (First 2 months):**
- 10M input tokens/month
- 3M output tokens/month

**After Free Tier:**
- ~$0.001 per conversation
- ~$1-5 per 1000 conversations

---

## 🆘 Common Issues

### "Invalid security token"
→ Wrong credentials. Double-check copy/paste.

### "Not authorized to perform bedrock:InvokeModel"
→ Missing permission. Add `AmazonBedrockFullAccess` policy.

### "Could not resolve model"
→ No model access. Go to Bedrock → Model access → Request access.

---

## 📚 Full Guides

- **Detailed Setup**: See `AWS_CREDENTIALS_SETUP.md`
- **GenAI Features**: See `GENAI_SETUP_GUIDE.md`

---

**That's it! Your AI is ready to chat.** 🤖
