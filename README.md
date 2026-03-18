# 🥂 Maurice&Mia — Premium Vacation Apartment

A luxurious, futuristic booking platform and content management system (CMS) tailored for the **Maurice&Mia** private apartment. Transitioned from traditional layouts to a high-end 2030 "AI Modern" aesthetic.

---

## ✨ Features at a Glance

### 💎 Immersive Public Portal
- **AI-Inspired UI**: Animated mesh-gradient backgrounds, advanced glassmorphism (20px blur with neon-soft border glows), and cyber-inspired micro-interactions.
- **Scroll-Aware Narrative**: Horizontal and vertical scroll-reveal animations that tell the apartment's story through high-end imagery.
- **Dynamic Content**: Every title, tag, and paragraph is powered by the backend but feels hardcoded for performance.

### 👴 "Grandpa-Friendly" CMS
- **No-Code Management**: A dedicated "Homepage Content" section in the Admin panel allows non-technical users to edit every word on the site instantly.
- **Smart Fallbacks**: Hardcoded premium defaults ensure the design remains pristine even if a CMS field is cleared.
- **Public Contact Sync**: Publicly visible contact information (Name, Email, Phone) is updated site-wide from a single dashboard.

### 📅 Advanced Booking Hub
- **Diagonal Check-in/out**: A modern, visual calendar that precisely shows half-day occupancy through CSS diagonal gradients.
- **Conflict Prevention**: Robust database-level and frontend validation to prevent overlapping bookings.
- **EmailJS Integration**: Automated, branded email notifications for both guests and administrators.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Vue 3 (Composition API), Vite, TypeScript |
| **Styling** | Vanilla CSS (Glassmorphism 2.0, CSS Keyframes) |
| **Database** | Supabase (PostgreSQL, Row Level Security) |
| **Messaging** | EmailJS (Client-side SMTP logic) |

---

## 🚀 Environment Configuration

Create a `.env` file in the root directory with the following keys:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_...
VITE_EMAILJS_TEMPLATE_GUEST=template_...
VITE_EMAILJS_TEMPLATE_ADMIN=template_...
VITE_EMAILJS_PUBLIC_KEY=public_...
```

---

## 📐 Database Schema

The platform requires a `settings` table in Supabase with the following extended columns for the CMS:

```sql
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS hero_tag TEXT,
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS section1_tag TEXT,
ADD COLUMN IF NOT EXISTS section1_title TEXT,
ADD COLUMN IF NOT EXISTS section1_text TEXT,
ADD COLUMN IF NOT EXISTS section2_tag TEXT,
ADD COLUMN IF NOT EXISTS section2_title TEXT,
ADD COLUMN IF NOT EXISTS section2_text TEXT,
ADD COLUMN IF NOT EXISTS section3_tag TEXT,
ADD COLUMN IF NOT EXISTS section3_title TEXT,
ADD COLUMN IF NOT EXISTS section3_text TEXT,
ADD COLUMN IF NOT EXISTS spec1_val TEXT,
ADD COLUMN IF NOT EXISTS spec1_label TEXT,
ADD COLUMN IF NOT EXISTS spec2_val TEXT,
ADD COLUMN IF NOT EXISTS spec2_label TEXT,
ADD COLUMN IF NOT EXISTS spec3_val TEXT,
ADD COLUMN IF NOT EXISTS spec4_val TEXT,
ADD COLUMN IF NOT EXISTS contact_title TEXT,
ADD COLUMN IF NOT EXISTS contact_subtitle TEXT,
ADD COLUMN IF NOT EXISTS contact_details_title TEXT;
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
