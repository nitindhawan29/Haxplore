"use client";

import Link from "next/link";
import { Trash2, TrendingUp, Users, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-2">Welcome back, Administrator.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Manage Bins Card */}
                    <Link href="/admin/bins" className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:scale-[1.02] transition-all">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                            <Trash2 className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Manage Bins</h2>
                        <p className="text-slate-500 text-sm">Update bin fill levels, status, and locations in real-time.</p>
                    </Link>

                    {/* Placeholder Stats */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 opacity-60">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Analytics</h2>
                        <p className="text-slate-500 text-sm">Coming soon: Usage statistics and collection efficiency.</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 opacity-60">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">User Management</h2>
                        <p className="text-slate-500 text-sm">Coming soon: manage roles and access.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
