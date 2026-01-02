# 🎯 AP Police FIR System - Quick Usage Guide

## 🚀 Starting the Application

### Option 1: Development Mode
```bash
npm run dev
```
Then open: **http://localhost:3000**

### Option 2: Production Build
```bash
npm run build
npm start
```

### Option 3: Use the Batch File (Windows)
Double-click: **FINAL-RUN.bat**

---

## 📍 Navigation Flow

### 1️⃣ Landing Page (`/`)
**What you see:**
- Animated hero section
- "START NOW" button (goes to Dashboard)
- "Login" button (goes to Login page)
- Feature showcase
- AI capabilities
- FIR Automation features

**Actions:**
- Click **"START NOW"** → Dashboard directly
- Click **"Login"** → Login page with role selection

---

### 2️⃣ Login Page (`/login`)

**Step 1: Select User Type**
- **Police Officer** → Proceed to role selection
- **Citizen** → Proceed to login form
- **Skip & Continue as Guest** → Go to dashboard

**Step 2: Police Role Selection** (if Police Officer selected)
- **Constable** - Field officer
- **Sub Inspector (SI)** - Mid-level officer
- **Circle Inspector (CI)** - Senior officer
- **Admin** - System administrator

**Step 3: Fill Credentials** (Mock - accepts any input)
- Full Name (any text)
- Employee ID (for police only)
- Mobile Number (any number)
- Email Address (any email)
- Click "Send OTP"
- Enter any 6 digits for OTP
- Click "Verify & Login"

**Skip Option:**
- Available at every step
- Click "Skip & Continue" to bypass login

---

### 3️⃣ Dashboard (`/dashboard`)

## Overview Tab (Default)

### Statistics Cards (Top)
Four animated cards showing:
1. **Pending Approvals** - Yellow/Orange gradient
2. **Approved Today** - Green gradient
3. **Cases Assigned** - Blue gradient
4. **Avg Response Time** - Purple gradient

### Quick Actions Section
Three action cards:
1. **Create New FIR** 
   - Opens modal with 3 methods
   - Blue gradient icon
   
2. **Track FIR Status**
   - Search functionality
   - Purple gradient icon
   
3. **Download FIR Copy**
   - PDF download
   - Green gradient icon

### Recent FIRs List
- Shows last 5 FIRs
- Click any FIR to view details
- Status indicators (pending/approved/rejected)
- Priority badges (high/medium/low)

---

## My Cases Tab

**What you see:**
- All FIRs assigned to you
- Complete case cards with:
  - Case number (e.g., VJA-2026-001)
  - Title and description
  - Complainant name
  - Crime type
  - Location
  - IPC sections
  - Status badge
  - Date created

**Actions:**
- Click any case card → Opens FIR details modal

---

## Pending Approvals Tab

**What you see:**
- FIRs waiting for your signature
- Filter panel (show/hide with "Filters" button)
- Each FIR shows:
  - Case number with priority badge
  - Title and description
  - Location, date, complainant
  - Review button

**Filter Options:**
- Priority: All/High/Medium/Low
- Crime Type: Dropdown with all types
- Date: Date picker

**Action Buttons (per FIR):**
1. **✅ Approve** - Green gradient button
2. **❌ Reject** - Red gradient button
3. **✏️ Request Changes** - Glass button
4. **👁️ Review** - Opens full FIR details

---

## Search Tab

**What you see:**
- Large search bar at top
- Search by:
  - Case number
  - Complainant name
  - Location
- Real-time filtering as you type
- All matching FIRs displayed

**Each Result Shows:**
- Case number and title
- Complainant, location, date
- Status badge
- Download button (📥)

**Actions:**
- Click result → View full details
- Click download icon → Get PDF

---

## Reports Tab

**Statistics Section:**
- Total Cases
- Pending count
- Approved count
- Visual breakdown

**Download Reports:**
Four pre-built reports:
- Daily Diary
- Weekly Stats
- Monthly Report
- Officer Performance

**Export Buttons:**
- 📥 Export to PDF
- 📥 Export to Excel

---

## 🎨 Create FIR Flow

### Step 1: Open Modal
Click **"Create New FIR"** from Quick Actions

### Step 2: Select Method
Three options appear:

#### 1️⃣ Manual Form (Blue icon)
**What happens:**
- Full form with all fields
- Sections:
  - Complainant Details (name, father's name, age, phone, address)
  - Crime Type dropdown (20+ options)
  - Incident Description (textarea)
  - Date/Time of occurrence
  - Place of occurrence
  - IPC Sections (AI suggested chips)
  - Evidence Upload (drag & drop area)

**Submit Options:**
- **Sign & Submit FIR** - Blue gradient button
- **Save as Draft** - Glass button

#### 2️⃣ Use Template (Purple icon)
**What happens:**
- Grid of 20 crime templates
- Click any template
- Form appears with pre-filled data
- Fill only variable fields:
  - Complainant name
  - Specific location
  - Additional details

**Submit:**
- **Generate & Sign FIR** - Creates FIR from template

#### 3️⃣ Voice-to-Text (Green icon)
**What happens:**
- Large microphone icon in center
- Click "Start Recording" button
- Mic turns red, starts recording
- Live transcription shows below
- AI structures into FIR format

**Controls:**
- **Start Recording** - Green button
- **Stop Recording** - Red button

---

## 📋 FIR Details Modal

**Opens when you click any FIR**

**Header:**
- Case number (large, gradient text)
- Case title
- Close button (X)

**Status Cards (4 across):**
1. Status (Pending/Approved/Rejected)
2. Priority (High/Medium/Low)
3. Date created
4. Location

**Complainant Details Section:**
- Name
- Crime type
- IPC sections (color-coded chips)
- Assigned officer

**Incident Description:**
- Full narrative text
- Formatted paragraphs

**Action Buttons (Bottom):**
- **📥 Download PDF** - Blue gradient
- **✍️ Digital Sign** - Glass button

---

## 🎯 Mock Data Overview

### Sample FIRs Included:

**FIR 1:**
- Case: VJA-2026-001
- Title: Theft at Main Market
- Complainant: Rajesh Kumar
- Type: Theft
- Status: Pending
- Priority: High
- IPC: 379, 380

**FIR 2:**
- Case: VJA-2026-002
- Title: Domestic Violence Case
- Complainant: Priya Reddy
- Type: Domestic Violence
- Status: Approved
- Priority: Medium
- IPC: 498A, 323

**FIR 3:**
- Case: VJA-2026-003
- Title: Cyber Fraud Report
- Complainant: Suresh Babu
- Type: Cyber Crime
- Status: Pending
- Priority: High
- IPC: 420, 467

---

## 🔔 Header Features

### Notification Bell
- Click bell icon → View notifications
- Red dot indicates new notifications

### Logout Button
- Click "Logout" → Clears session
- Returns to landing page

### User Info
- Shows current user name
- Shows role (CONSTABLE/SI/CI/ADMIN/PUBLIC)

---

## 🎨 UI Elements Guide

### Color Meanings:

**Status:**
- 🟢 Green = Approved
- 🟡 Yellow = Pending
- 🔴 Red = Rejected
- ⚪ Gray = Draft

**Priority:**
- 🔴 Red = High
- 🟡 Yellow = Medium
- 🔵 Blue = Low

**Actions:**
- 🔵 Blue Gradient = Primary action
- 🟣 Purple = Secondary
- ⚪ Glass = Tertiary

### Hover Effects:
- Cards lift up 5px
- Buttons glow
- Icons scale up
- Cursor changes to pointer

---

## 💡 Tips & Tricks

### Quick Navigation:
1. Use tab buttons at top to switch views
2. Click logo to return to landing page
3. Use back button in modals
4. Press ESC to close modals (coming soon)

### Search Tips:
1. Start typing immediately - no need to press enter
2. Search is case-insensitive
3. Searches across multiple fields

### Filter Tips:
1. Combine multiple filters
2. Clear by selecting "All"
3. Filters work in real-time

### Performance:
1. All animations are GPU-accelerated
2. Mobile-responsive on all screens
3. Works on Chrome, Firefox, Safari, Edge

---

## 🚨 Troubleshooting

### Server won't start?
```bash
# Kill existing processes
taskkill /F /IM node.exe

# Clear cache
rmdir /s /q .next

# Reinstall
npm install

# Try again
npm run dev
```

### Port 3000 already in use?
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port
# In package.json: "dev": "next dev -p 3001"
```

### Build fails?
```bash
# Clear everything
npm run clean  # if script exists
rm -rf node_modules .next
npm install
npm run build
```

---

## 📱 Mobile Usage

**Responsive Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**
- Bottom navigation (coming soon)
- Swipe gestures (coming soon)
- Touch-friendly buttons (48px min)
- Reduced animations
- Optimized images

---

## 🎓 Learning Resources

### Next.js Docs:
https://nextjs.org/docs

### Framer Motion:
https://www.framer.com/motion/

### Tailwind CSS:
https://tailwindcss.com/docs

---

## ✅ Checklist for Demo

Before showing to client:

- [ ] Server running on localhost:3000
- [ ] Landing page loads with animations
- [ ] Can navigate to login
- [ ] Can skip login and reach dashboard
- [ ] All 5 tabs work
- [ ] Create FIR modal opens
- [ ] All 3 FIR methods show
- [ ] Can view FIR details
- [ ] Search works
- [ ] Stats cards animate
- [ ] No console errors

---

## 🎉 You're All Set!

The application is fully functional with:
✅ Beautiful landing page
✅ Complete login flow
✅ Full-featured dashboard
✅ 3-method FIR creation
✅ Mock authentication
✅ Animated UI
✅ Responsive design

**Enjoy exploring the AP Police FIR Management System!** 🚓

