"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, QrCode, Smartphone, Wifi, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BinPage() {
    const params = useParams();
    const router = useRouter();
    const [scanned, setScanned] = useState(false);

    const handleMockScan = () => {
        setScanned(true);
        setTimeout(() => {
            router.push(`/deposit/${params.id}`);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden flex flex-col">

            {/* Background Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header - High Z-Index ensuring clickability */}
            <div className="absolute top-0 left-0 w-full p-6 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-start">
                    <Link
                        href="/find"
                        className="group flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/10 shadow-lg cursor-pointer"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-emerald-500/20 shadow-lg">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-xs font-bold tracking-wide">ONLINE</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full">
                <div className="w-full max-w-sm md:max-w-4xl grid md:grid-cols-2 gap-12 items-center">

                    {/* Desktop Instructions Side */}
                    <div className="hidden md:block space-y-8 text-left">
                        <div>
                            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4">
                                Connect to Bin
                            </h1>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                                You are nearing the Smart Bin. Scan the QR code displayed on the bin's screen to start your deposit session.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div className="text-sm text-slate-300">
                                    <span className="text-white font-semibold block">Step 1</span>
                                    Open your camera app
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                    <QrCode className="w-5 h-5" />
                                </div>
                                <div className="text-sm text-slate-300">
                                    <span className="text-white font-semibold block">Step 2</span>
                                    Scan the code on the screen
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Interaction Card */}
                    <div className="w-full flex justify-center">
                        {!scanned ? (
                            <div
                                className="relative group cursor-pointer w-full max-w-[320px] mx-auto"
                                onClick={handleMockScan}
                            >
                                {/* Card Container */}
                                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-primary/10">

                                    <div className="space-y-1 text-center">
                                        <h2 className="text-2xl font-bold text-white">Welcome!</h2>
                                        <p className="text-xs font-mono text-slate-400">ID: {params.id ? (Array.isArray(params.id) ? params.id[0] : params.id).slice(0, 6).toUpperCase() : 'UNKNOWN'}</p>
                                    </div>

                                    <div className="relative w-48 h-48 bg-white rounded-2xl p-3 shadow-inner">
                                        <QrCode className="w-full h-full text-slate-900" />

                                        {/* Corner Markers */}
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -translate-x-1 -translate-y-1 rounded-tl-lg" />
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary translate-x-1 -translate-y-1 rounded-tr-lg" />
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -translate-x-1 translate-y-1 rounded-bl-lg" />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary translate-x-1 translate-y-1 rounded-br-lg" />

                                        {/* Scanning Scanline */}
                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite] z-10" />
                                    </div>

                                    <div className="flex flex-col items-center gap-3 w-full">
                                        <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold shadow-lg shadow-white/10 group-hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            Tap to Simulate Scan
                                        </button>
                                        <p className="text-[10px] text-slate-400 text-center max-w-[200px]">
                                            Developer Mode: Tap button or QR to proceed without actual scanning.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-[320px] mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 text-center animate-in fade-in zoom-in duration-300 shadow-2xl">
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/40 relative">
                                    <Wifi className="w-12 h-12 text-white animate-pulse" />
                                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-30" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Connected!</h2>
                                <p className="text-slate-300 text-sm">Initiating secure deposit session...</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <div className="p-6 text-center z-10 md:hidden">
                <p className="text-xs text-slate-500">MVP Demo - Voiccy Hackathon</p>
            </div>
        </div>
    );
}

