# EcoSmart 🌿 - Smart E-Waste Management System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![OpenRouter AI](https://img.shields.io/badge/OpenRouter-Gemini_2.0-blue?style=for-the-badge&logo=google-gemini)](https://openrouter.ai/)

**EcoSmart** is a cutting-edge web and PWA solution designed to revolutionize electronic waste disposal. By combining AI-powered image recognition with a gamified user experience, we make recycling effortless, rewarding, and impactful.

---

## ✨ Features

- 📍 **Smart Bin Locator**: Interactive map to find the nearest certified e-waste bins with real-time status.
- 📸 **AI-Powered Scanning**: Instantly identify e-waste types and estimate their value using Gemini 2.0 Flash via OpenRouter.
- 🎁 **Instant Rewards**: Earn points and unlock achievements for every successful deposit.
- 📊 **Impact Dashboard**: Visualize your contribution to the environment with CO2 reduction metrics.
- 📱 **PWA Ready**: Installable on mobile devices for a seamless on-the-go experience.
- 👨‍💼 **Admin Portal**: Integrated dashboard for bin maintenance and collection route optimization.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase Account
- OpenRouter API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nitindhawan29/Haxplore.git
   cd Haxplore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_key
   ```

4. **Database Configuration**
   - Execute the SQL schema found in `supabase/migrations/` in your Supabase SQL editor.
   - Run `seed.sql` to populate initial bin locations.

5. **Launch**
   ```bash
   npm run dev
   ```

---

## 🛠 Tech Stack

| Component | Technology |
| --- | --- |
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS v4 |
| **Database** | Supabase (PostgreSQL) |
| **AI/ML** | Google Gemini 2.0 via OpenRouter |
| **Icons** | Lucide React |
| **State** | React Context API |

---

## 📂 Project Structure

```bash
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utilities and API clients
│   └── hooks/        # Custom React hooks
├── public/           # Static assets
├── supabase/         # Database migrations and seeds
└── docs/             # Documentation and setup guides
```

---

## 👥 Contributors

- **Nitin Dhawan** - [GitHub](https://github.com/nitindhawan29)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for Haxplore Hackathon</p>
