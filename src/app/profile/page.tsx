"use client";

import Link from "next/link";
import { ArrowLeft, Award, Database, Leaf, Menu, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const displayName = user?.email?.split('@')[0] || "Guest";

    const [stats, setStats] = useState({ points: 0, deposits: 0, co2: 0 });
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            // 1. Fetch Profile Stats
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

            // 2. Fetch Deposits History
            const { data: deposits, count } = await supabase
                .from('deposits')
                .select('*', { count: 'exact' })
                .eq('user_id', user.id)
                .order('timestamp', { ascending: false });

            if (profile) {
                // Calculate derived stats if not in profile, or use profile data
                // For now, simpler to count deposits from the deposits table 
                setStats({
                    points: profile.points || 0,
                    deposits: count || 0,
                    co2: profile.co2_saved_kg || 0
                });
            } else {
                // Might be a new user where trigger hasn't fired or just simple demo
                // We could auto-create here, but assuming trigger works or 0 default
            }

            if (deposits) {
                setHistory(deposits);
            }
            setLoading(false);
        };

        fetchData();

        // Realtime subscription could go here for instant updates
    }, [user]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const level = Math.floor(stats.points / 500) + 1;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center md:py-8">
            <div className="w-full max-w-2xl bg-white md:rounded-[2.5rem] md:shadow-2xl md:overflow-hidden flex flex-col min-h-screen md:min-h-0 relative">

                {/* Header Section */}
                <div className="bg-white p-6 pb-12 rounded-b-[2.5rem] shadow-sm relative overflow-hidden z-10 transition-all">
                    {/* Background Gradient Blob */}
                    <div className="absolute top-[-50%] left-[20%] w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex justify-between items-center mb-6">
                        <Link href="/" className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors border border-slate-100"><ArrowLeft className="w-5 h-5 text-slate-700" /></Link>
                        <button onClick={() => setIsMenuOpen(true)} className="p-2 -mr-2 hover:bg-slate-50 rounded-full transition-colors">
                            <Menu className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center mt-2 relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-tr from-primary to-secondary p-[3px] rounded-full shadow-lg mb-4">
                            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-white uppercase">
                                {displayName.slice(0, 2)}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 capitalize">{displayName}</h2>
                        <p className="text-primary font-medium text-sm bg-primary/5 px-3 py-1 rounded-full border border-primary/10 mt-1">Level {level} Recycler</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-10">
                        <div className="text-center group cursor-pointer">
                            <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">{stats.points}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Points</div>
                        </div>
                        <div className="text-center border-x border-slate-100 group cursor-pointer">
                            <div className="text-2xl font-bold text-secondary group-hover:scale-110 transition-transform">{stats.deposits}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Deposits</div>
                        </div>
                        <div className="text-center group cursor-pointer">
                            <div className="text-2xl font-bold text-emerald-500 group-hover:scale-110 transition-transform">{stats.co2.toFixed(1)}<span className="text-sm">kg</span></div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">CO2 Saved</div>
                        </div>
                    </div>
                </div>

                {/* Badges Carousel */}
                <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 px-1">Badges</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar mask-gradient-right">
                        <Badge icon={Leaf} color="bg-green-100 text-green-600" label="Earth Saver" />
                        <Badge icon={Database} color="bg-blue-100 text-blue-600" label="Data Miner" />
                        <Badge icon={Award} color="bg-yellow-100 text-yellow-600" label="Top 10" />
                        <Badge icon={Award} color="bg-purple-100 text-purple-600" label="Elite" />
                    </div>
                </div>

                {/* History */}
                <div className="flex-1 bg-white p-6 pt-2">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 px-1">Recent Activity</h3>
                    <div className="space-y-4">
                        {loading && <div className="text-center text-slate-400 py-4">Loading history...</div>}

                        {!loading && history.length === 0 && (
                            <div className="text-center text-slate-400 py-8 border border-dashed border-slate-200 rounded-2xl">
                                No deposits yet. <br /> <Link href="/find" className="text-primary font-bold underline">Find a bin</Link> to start!
                            </div>
                        )}

                        {history.map((item) => (
                            <HistoryItem
                                key={item.id}
                                title={`Recycled ${item.detected_type}`}
                                date={formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                points={`+${Math.ceil(item.estimated_value / 10)}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Drawer Menu */}
                {isMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px] animate-in fade-in duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <div className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-2xl z-50 p-6 flex flex-col animate-in slide-in-from-right duration-300 rounded-l-[2.5rem]">
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-xl text-slate-900">Menu</span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-2">
                                {/* Add other menu items here in future */}
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-500 text-center">
                                    More features coming soon!
                                </div>
                            </div>

                            <button
                                onClick={handleSignOut}
                                className="flex items-center justify-center gap-3 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

function Badge({ icon: Icon, color, label }: any) {
    return (
        <div className={`flex flex-col items-center flex-shrink-0 w-20`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">{label}</span>
        </div>
    )
}

function HistoryItem({ title, date, points }: any) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                    <RecycleIcon className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-slate-800">{title}</div>
                    <div className="text-xs text-slate-400">{date}</div>
                </div>
            </div>
            <div className="font-bold text-emerald-500">{points}</div>
        </div>
    )
}

function RecycleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
            <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
            <path d="m14 16-3 3 3 3" />
        </svg>
    )
}
