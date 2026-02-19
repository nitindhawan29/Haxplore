"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock authentication
        setTimeout(() => {
            if (email === "admin@ecosmart.com" && password === "admin123") {
                router.push("/admin/dashboard");
            } else {
                alert("Invalid credentials. Try admin@ecosmart.com / admin123");
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

                <div className="p-8 bg-slate-900 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-lg">
                            <ShieldCheck className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold">Admin Portal</h1>
                        <p className="text-slate-400 text-sm mt-2">Secure access for staff only</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email ID</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="staff@ecosmart.com"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? "Verifying..." : "Access Dashboard"}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-slate-400">
                            Authorized personnel only. <br />
                            Access attempts are logged.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
