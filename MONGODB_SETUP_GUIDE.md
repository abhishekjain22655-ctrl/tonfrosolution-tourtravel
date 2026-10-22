# Complete MongoDB Atlas Setup Guide (100% Free Forever)

This guide walks you through connecting your **MongoDB Atlas** database to the Travel Agency platform.

---

## ⚡ What Has Been Configured For You

1. **Native Mongoose Models** (`src/models/`):
   - `Package.ts`: Holiday packages with day-by-day itineraries, categories, prices, badges, and statuses.
   - `Enquiry.ts`: Customer lead capture, travel dates, passenger counts, and internal staff notes.
   - `Destination.ts`: Domestic and international destination catalogs.
   - `AdminSetting.ts`: Custom staff passcode and system configurations.

2. **Full REST API Layer** (`src/app/api/`):
   - `GET /api/status`: Real-time MongoDB health check and collection statistics.
   - `GET /api/packages` & `POST /api/packages`: Read and write holiday packages.
   - `GET /api/packages/[slug]`, `PUT`, `DELETE`: Retrieve, update, and remove packages.
   - `GET /api/destinations` & `POST /api/destinations`: Manage destinations.
   - `GET /api/enquiries` & `POST /api/enquiries` & `PATCH /api/enquiries`: Lead intake and management.
   - `POST /api/seed`: 1-Click database population with all sample holiday packages and destinations.

3. **Seamless Dual-Mode Fallback**:
   - The application **never crashes** if MongoDB is offline or if `MONGODB_URI` is not yet configured. It seamlessly serves packages and saves customer enquiries to local storage, and then syncs directly to MongoDB once connected!

---

## 🚀 How to Get Your Free MongoDB Atlas Cluster (3 Minutes)

MongoDB Atlas provides an **M0 Free Tier** cluster that is **free forever** with 512MB storage (enough for tens of thousands of packages and enquiries) and **no credit card required**.

### Step 1: Create a Free Atlas Account
1. Visit [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Select **M0 Free** (Shared) cluster option.
3. Choose your closest cloud provider region (e.g., AWS / Mumbai `ap-south-1` or closest to your customers).
4. Click **Create Deployment**.

### Step 2: Create a Database User & Network Access
1. **Database Access**: Under *Security* → *Database Access*, click **Add New Database User**:
   - Choose **Password** authentication.
   - Set a Username (e.g., `agencyAdmin`) and a secure Password.
   - Role: **Atlas Admin** or **Read and write to any database**.
   - Click **Add User**.
2. **Network Access**: Under *Security* → *Network Access*, click **Add IP Address**:
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) so your website and Vercel/local dev server can connect without firewall blocks.
   - Click **Confirm**.

### Step 3: Copy Your Connection String
1. Under *Deployments* → *Database*, click the **Connect** button next to your cluster.
2. Select **Drivers** (Node.js).
3. Copy the connection string. It will look like this:
   ```
   mongodb+srv://agencyAdmin:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<db_password>` with your actual database user password, and add `/travel_agency` before the `?`:
   ```
   mongodb+srv://agencyAdmin:YourPassword123@cluster0.abcde.mongodb.net/travel_agency?retryWrites=true&w=majority
   ```

---

## 📝 Step 4: Paste URI into `.env.local`

Open `.env.local` in this project's root folder and paste your connection string:

```bash
MONGODB_URI="mongodb+srv://agencyAdmin:YourPassword123@cluster0.abcde.mongodb.net/travel_agency?retryWrites=true&w=majority"
```

Save the file and restart the development server if needed:
```bash
npm run dev
```

---

## 🟢 Step 5: Seed Your Database in 1 Click!

1. Open the Admin Console: [http://localhost:3000/admin](http://localhost:3000/admin)
2. Log in with passcode: `admin123`
3. Notice the top header status badge turns to:
   🟢 **MongoDB Atlas Connected**
4. Go to the **Settings** tab.
5. In the **MongoDB Atlas Cloud Database** card, click:
   👉 **Seed / Re-sync Default Packages to MongoDB**
6. All packages and destinations are instantly inserted and indexed into your live MongoDB Atlas cloud database!
