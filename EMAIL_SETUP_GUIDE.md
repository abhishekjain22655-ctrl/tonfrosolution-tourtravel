# 📧 Email Notification Setup Guide (Gmail SMTP)

Your travel portal is already coded to send instant, beautifully formatted email alerts to your inbox every time a customer submits an enquiry.

All you need is a **Google 16-character App Password** for `Tonfrosolutionpvtltd@gmail.com`.

---

## 🚀 Quick Setup (Takes 2 Minutes)

### Step 1: Turn ON 2-Step Verification
1. Log into your Google account: **`Tonfrosolutionpvtltd@gmail.com`**.
2. Go to: **[https://myaccount.google.com/security](https://myaccount.google.com/security)**.
3. Under **"How you sign in to Google"**, make sure **2-Step Verification** is turned **ON** (required by Google to generate App Passwords).

---

### Step 2: Generate a Google App Password
1. Visit the App Passwords page directly:
   👉 **[https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**
2. In the **"App name"** input box, type:
   `Travel Website`
3. Click the blue **Create** button.
4. Google will display a yellow box with a **16-letter password** (e.g. `abcd efgh ijkl mnop`).
5. **Copy** this 16-character code.

---

### Step 3: Add to `.env.local`
Open your [.env.local](file:///.env.local) file and paste the password into `SMTP_PASS`:

```env
# Email Notifications for New Customer Enquiries (Gmail SMTP)
SMTP_USER=Tonfrosolutionpvtltd@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
NOTIFICATION_EMAIL=Tonfrosolutionpvtltd@gmail.com
```

*(Note: You can paste it with or without spaces, Google handles both.)*

---

### Step 4: Restart Your Dev Server
Whenever you edit `.env.local`, restart Next.js so it picks up the new environment variables:

1. In your terminal, press `Ctrl + C` to stop the server.
2. Run:
   ```bash
   npm run dev
   ```

---

## 🧪 How to Test It
1. Open your website in your browser (e.g. `http://localhost:3000/plan-your-trip` or any package detail page).
2. Fill out and submit an enquiry form.
3. Check `Tonfrosolutionpvtltd@gmail.com` inbox! You will receive an email alert with:
   - Customer Name & Phone Number
   - Selected Destination & Travel Dates
   - Instant "Chat on WhatsApp" & "Call Customer" buttons
