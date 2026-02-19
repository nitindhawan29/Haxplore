"use client";

import { useState } from "react";
import { X, Mail, Lock, ArrowRight, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

type AuthView = 'auth' | 'forgot_email' | 'forgot_otp' | 'reset_password';

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [view, setView] = useState<AuthView>('auth'); // auth, forgot_email, forgot_otp, reset_password
    const [isSignUp, setIsSignUp] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    if (!isOpen) return null;

    const resetState = () => {
        setView('auth');
        setEmail("");
        setPassword("");
        setOtp("");
        setNewPassword("");
        setError(null);
        setSuccessMsg(null);
        setLoading(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    // 1. Normal Login/Signup
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert("Account created! Check your email for confirmation link.");
                onSuccess();
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 2. Send OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: false }
            });
            if (error) throw error;
            setView('forgot_otp');
            setSuccessMsg("OTP code sent to your email!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 3. Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email'
            });
            if (error) throw error;
            setView('reset_password');
            setSuccessMsg("Email verified! secure your account.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 4. Update Password
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            alert("Password updated successfully!");
            onSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 transition-all">

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-slate-500" />
                </button>

                {/* Back Button (if not viewing auth) */}
                {view !== 'auth' && (
                    <button
                        onClick={() => setView('auth')}
                        className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                )}

                {/* Header */}
                <div className="p-8 pb-6 bg-slate-50 border-b border-slate-100 text-center">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {view === 'auth' ? (isSignUp ? "Create Account" : "Welcome Back") :
                            view === 'forgot_email' ? "Reset Password" :
                                view === 'forgot_otp' ? "Enter OTP" : "New Password"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {view === 'auth' ? (isSignUp ? "Sign up to start earning rewards" : "Sign in to access your wallet") :
                            view === 'forgot_email' ? "Enter your email to receive a code" :
                                view === 'forgot_otp' ? `Code sent to ${email}` : "Set a secure new password"}
                    </p>
                </div>

                {/* --- VIEW: LOGIN / SIGNUP --- */}
                {view === 'auth' && (
                    <form onSubmit={handleAuth} className="p-8 space-y-4 pt-4">
                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={async () => {
                                setLoading(true);
                                setError(null);
                                try {
                                    const { error } = await supabase.auth.signInWithOAuth({
                                        provider: 'google',
                                        options: {
                                            redirectTo: `${window.location.origin}/auth/callback`
                                        }
                                    });
                                    if (error) throw error;
                                } catch (err: any) {
                                    setError(err.message);
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="w-full py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500 font-bold">Or continue with email</span>
                            </div>
                        </div>

                        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                                {!isSignUp && (
                                    <button type="button" onClick={() => setView('forgot_email')} className="text-xs font-bold text-primary hover:text-primary/80">
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>{isSignUp ? "Create Account" : "Sign In"} <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>

                        <div className="pt-4 text-center">
                            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                            </button>
                        </div>
                    </form>
                )}

                {/* --- VIEW: FORGOT PASSWORD (EMAIL) --- */}
                {view === 'forgot_email' && (
                    <form onSubmit={handleSendOtp} className="p-8 space-y-4 pt-4">
                        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP Code"}
                        </button>
                    </form>
                )}

                {/* --- VIEW: FORGOT PASSWORD (OTP) --- */}
                {view === 'forgot_otp' && (
                    <form onSubmit={handleVerifyOtp} className="p-8 space-y-4 pt-4">
                        {successMsg && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-xl font-medium border border-green-100">{successMsg}</div>}
                        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">6-Digit Code</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium tracking-widest text-lg"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                        </button>
                    </form>
                )}

                {/* --- VIEW: RESET PASSWORD --- */}
                {view === 'reset_password' && (
                    <form onSubmit={handleUpdatePassword} className="p-8 space-y-4 pt-4">
                        {successMsg && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-xl font-medium border border-green-100">{successMsg}</div>}
                        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New secure password"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
