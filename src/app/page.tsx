"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { ArrowRight, Recycle, MapPin, Award, Zap, Laptop, Smartphone, Headphones, Battery, User, Globe, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Language } from "@/translations";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-green-500 selection:text-white transition-colors duration-300">
      <HeroSection user={user} onSignUpClick={() => setIsAuthModalOpen(true)} />
      <StatsSection />
      <ItemsGrid />
      <ThemeLines />
      <RewardsSection />
      <FeedbackSection />
      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
}

// --- Components ---

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
      <button
        onClick={toggleTheme}
        className="bg-white/80 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-full p-2 sm:p-3 shadow-xl hover:shadow-2xl transition-all text-slate-700 dark:text-white hover:scale-110 active:scale-95 group"
      >
        {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-rotate-12 transition-transform" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />}
      </button>
    </div>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'bn', label: 'বাংলা' },
  ];

  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
      <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-full p-1 sm:p-1.5 flex items-center shadow-xl hover:shadow-2xl transition-all">
        <div className="px-2 sm:px-3">
          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-white" />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent text-slate-700 dark:text-white text-xs sm:text-sm font-bold py-1.5 sm:py-2 pr-6 sm:pr-8 pl-1 rounded-full outline-none cursor-pointer appearance-none hover:bg-black/5 dark:hover:bg-white/10 transition-colors uppercase tracking-wide focus:ring-2 focus:ring-green-500/50"
          style={{ backgroundImage: 'none' }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-slate-900 bg-white dark:bg-slate-800 py-2">
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function HeroSection({ user, onSignUpClick }: { user: any, onSignUpClick: () => void }) {
  const { t } = useLanguage();
  const { scrollY } = useScroll();

  return (

    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white py-12 sm:py-16 md:py-20 transition-colors duration-300">
      <ThemeToggle />
      <LanguageSwitcher />

      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-40 mix-blend-overlay transition-opacity duration-300"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611003229186-5e40c5f423a3?q=80&w=2574&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/90 via-white/80 to-slate-50 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900 transition-colors duration-300" />

      {/* Animated Floating Icons Background */}
      <FloatingIcons />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-5xl flex flex-col items-center justify-center h-full pb-12 sm:pb-16 md:pb-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          style={{ display: 'inline-block' }}
        >
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            className="text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] xl:text-[240px] leading-none drop-shadow-2xl filter blur-sm hover:blur-none transition-all duration-500 opacity-20 dark:opacity-100"
          >
            ♻️
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-[1.1] drop-shadow-xl mt-4 sm:mt-6 md:mt-8 text-slate-900 dark:text-white px-2"
        >
          {t.hero.title}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-600 block mt-2 md:mt-4">{t.hero.subtitle}</span>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl block mt-4 md:mt-6 text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase">{t.hero.save}</span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-slate-600 dark:text-slate-300 font-medium max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-14 leading-relaxed px-4 sm:px-6 md:px-8 backdrop-blur-sm bg-white/40 dark:bg-black/10 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"
        >
          {t.hero.description}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 items-stretch sm:items-center w-full sm:w-auto px-4 sm:px-0"
        >
          <Link href="/find" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-lg sm:text-xl md:text-2xl lg:text-2xl text-white font-bold py-4 sm:py-5 md:py-6 px-8 sm:px-10 md:px-14 lg:px-16 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] flex items-center justify-center gap-3">
              {t.hero.cta_drop} <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </Link>

          {!user ? (
            <button
              onClick={onSignUpClick}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-lg sm:text-xl md:text-2xl lg:text-2xl text-slate-900 dark:text-white font-bold py-4 sm:py-5 md:py-6 px-8 sm:px-10 md:px-14 lg:px-16 rounded-full transition-all hover:scale-105 border-2 border-slate-300 dark:border-white/20 flex items-center justify-center gap-3"
            >
              {t.hero.cta_signup}
            </button>
          ) : (
            <Link href="/profile" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-lg sm:text-xl md:text-2xl lg:text-2xl text-slate-900 dark:text-white font-bold py-4 sm:py-5 md:py-6 px-8 sm:px-10 md:px-14 lg:px-16 rounded-full transition-all hover:scale-105 border-2 border-slate-300 dark:border-white/20 flex items-center justify-center gap-3">
                <User className="w-5 h-5 md:w-6 md:h-6" /> {t.hero.cta_wallet}
              </button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function FloatingIcons() {
  const icons = [<Laptop key="l" />, <Smartphone key="p" />, <Headphones key="h" />, <Battery key="b" />, <Zap key="z" />, <Recycle key="r" />];
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      scale: 0.5 + Math.random() * 1,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * -20,
      iconIndex: Math.floor(Math.random() * icons.length)
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute text-slate-700/20"
          initial={{ y: 0, rotate: 0 }}
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            scale: el.scale
          }}
          animate={{
            y: "-10vh",
            rotate: 360
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "linear",
            delay: el.delay
          }}
        >
          {icons[el.iconIndex]}
        </motion.div>
      ))}
    </div>
  );
}

function StatsSection() {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900 relative z-10 shadow-xl -mt-6 sm:-mt-8 md:-mt-10 rounded-t-[2rem] sm:rounded-t-[2.5rem] md:rounded-t-[3rem] mx-2 sm:mx-4 md:mx-0 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12 text-center">
          <StatCounter value={18000} label={t.stats.waste} />
          <StatCounter value={1557} label={t.stats.trees} />
          <StatCounter value={5200} label={t.stats.users} />
        </div>
      </div>
    </section>
  );
}

function StatCounter({ value, label }: { value: number, label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, { bounce: 0, duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <div ref={ref} className="flex flex-col items-center px-2">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-1 sm:mb-2 font-mono tracking-tight transition-colors">
        {displayValue.toLocaleString()}+
      </div>
      <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors">{label}</div>
    </div>
  );
}

function ItemsGrid() {
  const { t } = useLanguage();
  const items = [
    { title: t.items.laptop, img: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=2664" },
    { title: t.items.phone, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=2680" },
    { title: t.items.battery, img: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=2574&auto=format&fit=crop" },
    { title: t.items.cable, img: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=2574&auto=format&fit=crop" }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300" id="items">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-12 md:mb-16 text-slate-900 dark:text-white transition-colors"
        >
          {t.items.title}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          {items.map((item, idx) => (
            <ItemCard key={idx} title={item.title} img={item.img} />
          ))}
        </div>

        {/* Additional items row from original code */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="lg:col-span-1">
            <ItemCard
              title={t.items.circuit}
              img="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=2670"
              className="h-full min-h-[250px] sm:min-h-[300px]"
            />
          </div>
          <div className="lg:col-span-2">
            <ItemCard
              title={t.items.micro}
              img="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2670"
              className="h-full min-h-[250px] sm:min-h-[300px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ItemCard({ title, img, className = "" }: { title: string, img: string, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 hover:-rotate-1 hover:scale-[1.02] ${className}`}
    >
      <div className="aspect-[4/3] w-full h-full relative cursor-pointer">
        <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/95 via-green-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4 sm:p-6 md:p-8 backdrop-blur-[2px]">
          <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-black translate-y-8 group-hover:translate-y-0 transition-transform duration-500">{title}</h3>
        </div>
        {/* Default Title State */}
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 p-3 sm:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-300">
          <h3 className="font-bold text-slate-900 dark:text-white text-center text-sm sm:text-base md:text-lg transition-colors">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
}

function ThemeLines() {
  const { t } = useLanguage();
  return (
    <div className="py-12 sm:py-16 md:py-20 bg-green-50 dark:bg-green-950/20 text-center transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        {t.theme.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-green-900/80 dark:text-green-400/80 my-4 sm:my-6 md:my-8 italic px-4"
          >
            {line}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RewardsSection() {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white dark:bg-slate-900 overflow-hidden relative border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
      {/* Decorative Circles - Adaptive Opacity */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
          <div className="inline-block p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-sm">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 dark:text-yellow-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-slate-900 dark:text-white transition-colors px-4">{t.rewards.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed px-4">{t.rewards.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <RewardCard color="bg-orange-500" title={t.rewards.amazon} value="5000 pts" icon={<Award />} />
          <RewardCard color="bg-blue-500" title={t.rewards.metro} value="2000 pts" icon={<Zap />} />
          <RewardCard color="bg-emerald-500" title={t.rewards.coffee} value="1500 pts" icon={<Award />} />
          <RewardCard color="bg-green-600" title={t.rewards.donate} value="1000 pts" icon={<Recycle />} />
        </div>
      </div>
    </section>
  );
}

function RewardCard({ color, title, value, icon }: any) {
  const { t } = useLanguage();
  // Fallback if icon is undefined, though strictly it should be passed
  const iconElement = icon || <Award />;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="relative group"
    >
      <div className="absolute inset-x-2 sm:inset-x-4 top-2 sm:top-4 bottom-0 bg-slate-900/5 dark:bg-white/5 rounded-2xl sm:rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all duration-300 pointer-events-none" />
      <div className="relative h-full bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl md:rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center shadow-lg transition-colors overflow-hidden">

        {/* Glow Effect */}
        <div className={`absolute -top-20 -right-20 w-32 h-32 sm:w-40 sm:h-40 ${color} opacity-10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`} />

        <div className={`w-16 h-16 sm:w-20 sm:h-20 ${color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-md text-white transform group-hover:rotate-6 transition-transform duration-300`}>
          {React.cloneElement(iconElement, { className: "w-8 h-8 sm:w-10 sm:h-10" })}
        </div>

        <h3 className="font-bold text-lg sm:text-xl mb-2 text-slate-900 dark:text-white transition-colors">{title}</h3>
        <div className="text-slate-500 dark:text-slate-400 font-medium mb-6 sm:mb-8 bg-slate-200/50 dark:bg-slate-700/50 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm">{value}</div>

        <Link href="/profile" className="mt-auto w-full">
          <button className="w-full py-3 sm:py-4 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2">
            {t.rewards.redeem} <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

function FeedbackSection() {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState("");

  const emojis = [
    { label: "Terrible", icon: "😡" },
    { label: "Bad", icon: "☹️" },
    { label: "Okay", icon: "😐" },
    { label: "Good", icon: "🙂" },
    { label: "Amazing", icon: "😍" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 transition-colors px-4">How was your experience?</h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl transition-colors">
            <div className="flex justify-between mb-6 sm:mb-8 px-2 sm:px-4">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(index)}
                  className={`text-3xl sm:text-4xl transition-all hover:scale-125 focus:outline-none ${rating === index ? 'scale-125 grayscale-0' : 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100'}`}
                  title={emoji.label}
                >
                  {emoji.icon}
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more (optional)..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 focus:ring-2 focus:ring-green-500/50 focus:outline-none resize-none h-20 sm:h-24 dark:text-white placeholder:text-slate-400 transition-colors text-sm sm:text-base"
            />

            <button
              type="submit"
              disabled={rating === null}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 rounded-xl transition-all text-sm sm:text-base"
            >
              Submit Feedback
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-100 dark:bg-green-900/30 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-inner"
          >
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Thank You!</h3>
            <p className="text-green-700 dark:text-green-300 text-sm sm:text-base">Your feedback helps us save more trees.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-950 text-slate-500 py-8 sm:py-10 md:py-12 border-t border-slate-900">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">E</div>
          <span className="font-bold text-slate-300 text-sm sm:text-base">EcoSmart</span>
        </div>
        <div className="text-xs sm:text-sm text-center">
          {t.footer.copyright}
        </div>
        <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
          <Link href="/admin" className="hover:text-white transition-colors">{t.footer.staff}</Link>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
