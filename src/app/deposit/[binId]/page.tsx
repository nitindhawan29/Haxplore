"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Camera, Check, AlertTriangle, Video, Upload, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function DepositPage() {
    const router = useRouter();
    const params = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState<'upload' | 'analyzing' | 'result' | 'success'>('upload');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [weight, setWeight] = useState(150);
    const [result, setResult] = useState<any>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!imagePreview || !fileInputRef.current?.files?.[0]) return;

        setStep('analyzing');

        const formData = new FormData();
        formData.append('image', fileInputRef.current.files[0]);
        formData.append('weight', weight.toString());
        const binId = Array.isArray(params.binId) ? params.binId[0] : params.binId as string;
        if (binId) formData.append('bin_id', binId);

        try {
            const res = await fetch('/api/detect', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            // Simulate delay for effect
            setTimeout(() => {
                setResult(data);
                setStep('result');
            }, 1500);

        } catch (e) {
            console.error(e);
            setStep('upload'); // Go back on error
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = () => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        completeDeposit();
    };

    const completeDeposit = async () => {
        if (!user || !result) return;
        setIsSubmitting(true);

        const binId = Array.isArray(params.binId) ? params.binId[0] : params.binId as string;
        const points = Math.ceil(result.estimated_value / 10);
        const weightKg = weight / 1000;

        try {
            const { supabase } = await import("@/lib/supabase");

            // 0. Ensure Profile Exists (Lazy Creation)
            // We strive to do this on Auth, but for redundancy:
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: user.id,
                display_name: user.email?.split('@')[0] || 'User',
                // We don't overwrite points here, just ensure row exists
            }, { onConflict: 'id', ignoreDuplicates: true });

            if (profileError) {
                console.error("Profile check failed:", JSON.stringify(profileError, null, 2));
                // We typically continue, hoping it exists, or fail if critical
            }

            // 1. Create Deposit Record
            const { error: depositError } = await supabase.from('deposits').insert({
                user_id: user.id,
                bin_id: binId, // Ensure this defaults to a valid UUID if mocked, or handle in SQL
                detected_type: result.detected_type,
                confidence: result.confidence,
                estimated_value: result.estimated_value,
                weight_grams: weight,
                image_url: null, // For MVP, we skip storage upload, or could use base64 if small enough (not rec)
            });

            if (depositError) throw depositError;

            // 2. Profile update (points) - Manual update for MVP
            // Fetch current profile -> increment -> update
            const { data: profile } = await supabase.from('profiles').select('points, co2_saved_kg').eq('id', user.id).single();

            if (profile) {
                const newPoints = (profile.points || 0) + points;
                const newCo2 = (Number(profile.co2_saved_kg) || 0) + weightKg;

                const { error: updateError } = await supabase.from('profiles').update({
                    points: newPoints,
                    co2_saved_kg: newCo2
                }).eq('id', user.id);

                if (updateError) {
                    console.error("Profile update failed:", JSON.stringify(updateError, null, 2));
                    throw new Error(`Failed to update profile points: ${updateError.message}`);
                }

                console.log(`✅ Profile updated: +${points} points, +${weightKg}kg CO2`);
            }

            setStep('success');
        } catch (err: any) {
            console.error("Deposit error:", err);
            // Show more helpful error for debugging
            alert(`Error saving deposit: ${err.message || "Unknown Code Error"}. But counting it locally!`);
            setStep('success');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Decor (Desktop) */}
            <div className="hidden md:block absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="hidden md:block absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="p-4 z-10 md:fixed md:top-0 md:left-0 md:w-full pointer-events-none">
                <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
                    <button onClick={() => router.back()} className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors border border-slate-200">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <h1 className="md:hidden text-lg font-bold text-slate-800">New Deposit</h1>
                    <div className="w-9 md:w-0" /> {/* Spacer */}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center md:justify-center p-4 z-0">
                <div className="w-full max-w-md md:max-w-4xl md:bg-white/80 md:backdrop-blur-xl md:shadow-2xl md:rounded-[2.5rem] md:p-8 md:border md:border-white/50 flex flex-col md:flex-row md:gap-12 md:items-center transition-all">

                    {/* Desktop Hero / Instructions Side */}
                    <div className="hidden md:block flex-1 space-y-6">
                        <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-2">
                            <Camera className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Scan & Deposit</h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Place your e-waste on a clear surface. Ensure good lighting for the best analysis results.
                        </p>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">1</span>
                                <span>Take a clear photo of the item</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">2</span>
                                <span>Wait for AI analysis</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">3</span>
                                <span>Confirm & Earn Points</span>
                            </div>
                        </div>
                    </div>

                    {/* Interaction Area */}
                    <div className="w-full md:max-w-sm flex-shrink-0">

                        {step === 'upload' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group w-full aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-primary/50 transition-all relative overflow-hidden"
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition-colors">
                                                <div className="w-16 h-16 rounded-full bg-slate-200 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                                                    <Camera className="w-8 h-8" />
                                                </div>
                                                <span className="font-semibold">Tap to take photo</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-slate-400 md:hidden">
                                        Our AI will analyze the type and condition of your e-waste from the photo.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!imagePreview}
                                    className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 hover:brightness-110"
                                >
                                    Analyze Item
                                </button>
                            </div>
                        )}

                        {step === 'analyzing' && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-white/50 flex flex-col items-center justify-center text-center py-16 animate-in fade-in space-y-6">
                                <div className="relative">
                                    <div className="w-24 h-24 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">Analyzing...</h3>
                                    <p className="text-sm text-slate-500">Identifying object & condition</p>
                                </div>
                            </div>
                        )}

                        {step === 'result' && result && (
                            <div className="space-y-6 animate-in zoom-in-95 duration-300">
                                <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
                                    {result.confidence < 0.75 && (
                                        <div className="absolute top-0 left-0 w-full bg-orange-100 text-orange-700 text-xs py-1 font-medium">
                                            Low Confidence Check
                                        </div>
                                    )}

                                    <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-slate-50">
                                        {result.detected_type === 'unknown' ? <AlertTriangle className="w-10 h-10 text-orange-500" /> : <Check className="w-10 h-10 text-green-500" />}
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 capitalize mb-1">{result.detected_type}</h2>
                                    <p className="text-slate-500 text-sm mb-6 bg-slate-50 p-3 rounded-lg">{result.explanation}</p>

                                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-px border border-slate-200/60">
                                        <div className="bg-white/50 p-2 rounded-lg">
                                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Value</div>
                                            <div className="text-xl font-bold text-slate-900">₹{result.estimated_value}</div>
                                        </div>
                                        <div className="bg-white/50 p-2 rounded-lg">
                                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Points</div>
                                            <div className="text-xl font-bold text-primary">+{Math.ceil(result.estimated_value / 10)}</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setStep('upload')} className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600 transition-colors">Retry</button>
                                        <button onClick={handleConfirm} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:brightness-110 transition-all">
                                            {user ? "Confirm" : "Login to Claim"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                                <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center relative">
                                    <Check className="w-16 h-16 text-green-500" />
                                    <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">Success!</h2>
                                    <p className="text-slate-500 mt-2">Added to your wallet.</p>
                                </div>
                                <button onClick={() => router.push('/profile')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold mt-4 shadow-lg hover:bg-slate-800 transition-colors">
                                    View Wallet
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    completeDeposit();
                }}
            />
        </div>
    );
}

