"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, RefreshCw, Edit, Trash2, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { generateBins, SimulatedBin } from "@/lib/simulation";

// Re-use types from simulation or define new ones matching DB
interface Bin {
    id: string; // UUID in DB
    name: string;
    lat: number;
    lng: number;
    accepts: string[];
    fill_percent: number;
    status: 'operational' | 'full' | 'maintenance';
    last_updated: string;
}

export default function AdminBinsPage() {
    // const supabase = createClientComponentClient();
    const [bins, setBins] = useState<Bin[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    // Edit Modal State
    const [editingBin, setEditingBin] = useState<Bin | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch Bins
    const fetchBins = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('bins')
            .select('*')
            .order('name');

        if (error) console.error("Error fetching bins:", error);
        else setBins(data || []);

        setLoading(false);
    };

    // Real-time Subscription
    useEffect(() => {
        fetchBins();

        const channel = supabase
            .channel('admin-bins-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bins' }, (payload: any) => {
                console.log('Change received!', payload);
                fetchBins(); // Refresh list on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Seed Data
    const handleSeedData = async () => {
        if (!confirm("This will Delete ALL existing bins and create new simulated ones around Bhopal. Continue?")) return;

        setSeeding(true);

        // 1. Delete all bins
        const { error: deleteError } = await supabase.from('bins').delete().neq('name', 'PLACEHOLDER_TO_DELETE_ALL');
        // Note: Delete without where clause might be blocked by RLS or Safe Mode in some SQL contexts, 
        // but typically .neq('id', '0000...') works. 
        // Let's try deleting all.
        await supabase.from('bins').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // 2. Generate new bins (Bhopal)
        const newBins = generateBins(23.259933, 77.412613, 15);

        // 3. Prepare for Insert (remove ID to let DB generate UUID, or keep ID if UUID compatible?)
        // The simulation generates string IDs like '1', '2'. DB expects UUIDs usually?
        // Schema says: id uuid PRIMARY KEY DEFAULT gen_random_uuid()
        // So we should NOT send 'id' if we want auto-generation, OR we must generate valid UUIDs.
        // The simulation IDs are strings like "101". That won't fit UUID.
        // We will omit 'id' and let Supabase generate it.

        const cleanBins = newBins.map(({ id, ...rest }) => ({
            ...rest,
            // Ensure types match DB
        }));

        const { error: insertError } = await supabase.from('bins').insert(cleanBins);

        if (insertError) {
            alert("Error seeding data: " + insertError.message);
        } else {
            alert("Database seeded successfully!");
        }

        setSeeding(false);
        fetchBins();
    };

    // Update Bin
    const handleUpdateBin = async () => {
        if (!editingBin) return;

        const { error } = await supabase
            .from('bins')
            .update({
                fill_percent: editingBin.fill_percent,
                status: editingBin.status,
                accepts: editingBin.accepts
            })
            .eq('id', editingBin.id);

        if (error) {
            alert("Error updating bin: " + error.message);
        } else {
            setIsModalOpen(false);
            setEditingBin(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">Manage Bins</h1>
                    </div>

                    <button
                        onClick={handleSeedData}
                        disabled={seeding}
                        className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
                        {seeding ? 'Seeding...' : 'Reset Demo Data'}
                    </button>
                </div>

                {/* Bins List */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-4 font-bold text-slate-500 text-sm">Bin Name</th>
                                    <th className="p-4 font-bold text-slate-500 text-sm">Status</th>
                                    <th className="p-4 font-bold text-slate-500 text-sm">Fill Level</th>
                                    <th className="p-4 font-bold text-slate-500 text-sm">Accepted Types</th>
                                    <th className="p-4 font-bold text-slate-500 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bins.map((bin) => (
                                    <tr key={bin.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{bin.name}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {bin.lat.toFixed(4)}, {bin.lng.toFixed(4)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${bin.status === 'operational' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                bin.status === 'full' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                }`}>
                                                {bin.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="w-24 bg-slate-100 rounded-full h-2 mb-1 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${bin.fill_percent > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${bin.fill_percent}%` }}
                                                />
                                            </div>
                                            <div className="text-xs font-medium text-slate-500">{bin.fill_percent}%</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {bin.accepts?.map(t => (
                                                    <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded capitalize">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setEditingBin(bin);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {bins.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400">
                                            No bins found. Use "Reset Demo Data" to generate some.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && editingBin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Edit Bin: {editingBin.name}</h2>

                        <div className="space-y-4">
                            {/* Fill Level */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Fill Level: {editingBin.fill_percent}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={editingBin.fill_percent}
                                    onChange={(e) => setEditingBin({ ...editingBin, fill_percent: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                <select
                                    value={editingBin.status}
                                    onChange={(e) => setEditingBin({ ...editingBin, status: e.target.value as any })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="operational">Operational</option>
                                    <option value="full">Full</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>

                            {/* Accepted Items */}
                            {/* Simplified for demo - toggle commonly used ones */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Accepted Items</label>
                                <div className="flex flex-wrap gap-2">
                                    {['phone', 'laptop', 'battery', 'charger', 'cable'].map(item => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                const current = editingBin.accepts || [];
                                                const newAccepts = current.includes(item)
                                                    ? current.filter(i => i !== item)
                                                    : [...current, item];
                                                setEditingBin({ ...editingBin, accepts: newAccepts });
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${editingBin.accepts?.includes(item)
                                                ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500/20'
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                        >
                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateBin}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
