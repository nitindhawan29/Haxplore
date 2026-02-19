"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Battery, Smartphone, Laptop, Plug, Cable, ArrowRight, MapPin, Search, Filter, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimulatedBin } from "@/lib/simulation";
import dynamic from 'next/dynamic';
import { supabase } from "@/lib/supabase";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const CityMap = dynamic(() => import('@/components/CityMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-medium">
            Loading Map...
        </div>
    )
});

const WASTE_TYPES = [
    { id: 'phone', label: 'Phone', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'laptop', label: 'Laptop', icon: Laptop, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'battery', label: 'Battery', icon: Battery, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'charger', label: 'Charger', icon: Plug, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'cable', label: 'Cable', icon: Cable, color: 'text-gray-500', bg: 'bg-gray-50' },
];

// Default to Bhopal, India
const DEFAULT_CENTER: [number, number] = [23.259933, 77.412613];

export default function FindPage() {
    // const supabase = createClientComponentClient(); // Removed
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Map State
    const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
    const [zoom, setZoom] = useState(13);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

    // Data State
    const [bins, setBins] = useState<SimulatedBin[]>([]);
    const [displayBins, setDisplayBins] = useState<SimulatedBin[]>([]);
    const [activeBinId, setActiveBinId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false); // Mobile sheet state

    // Fetch Bins & Subscribe
    const fetchBins = async () => {
        try {
            const { data, error } = await supabase.from('bins').select('*');
            if (error) {
                console.warn("Database not configured, using mock data. See SUPABASE_DATABASE_SETUP.md");
                // Use mock data if database fails
                setBins(getMockBins());
            } else if (data && data.length > 0) {
                console.log(`✅ Loaded ${data.length} bins from database`);
                setBins(data as SimulatedBin[] || []);
            } else {
                // No data in database, use mock data
                console.log("📦 No bins in database, using mock data");
                setBins(getMockBins());
            }
        } catch (err) {
            console.warn("Database connection failed, using mock data");
            setBins(getMockBins());
        }
        setLoading(false);
    };

    // Mock data fallback
    const getMockBins = (): SimulatedBin[] => [
        {
            id: '858c973a-4416-43c2-8415-3855bf09c313',
            name: 'MG Road Bin 01',
            lat: 23.259933,
            lng: 77.412613,
            accepts: ['battery', 'phone', 'charger'],
            fill_percent: 20,
            status: 'operational',
            last_updated: new Date().toISOString()
        },
        {
            id: 'c97036a4-601d-4447-9092-7484d28baec4',
            name: 'College Gate Bin A',
            lat: 23.265933,
            lng: 77.418613,
            accepts: ['laptop', 'phone', 'cable'],
            fill_percent: 75,
            status: 'operational',
            last_updated: new Date().toISOString()
        },
        {
            id: 'a43a0109-77f6-4940-9759-4d6d628d0959',
            name: 'Community Center Bin B',
            lat: 23.255933,
            lng: 77.408613,
            accepts: ['battery', 'cable'],
            fill_percent: 95,
            status: 'full',
            last_updated: new Date().toISOString()
        },
        {
            id: '3b0d235e-85a0-47b7-849c-f23075249448',
            name: 'Tech Park Bin C',
            lat: 23.270933,
            lng: 77.420613,
            accepts: ['laptop', 'phone', 'battery', 'charger', 'cable'],
            fill_percent: 10,
            status: 'operational',
            last_updated: new Date().toISOString()
        }
    ];

    useEffect(() => {
        // Initial Fetch
        fetchBins();

        // Realtime Subscription (only if database is configured)
        // Uncomment when database is set up
        /*
        const channel = supabase
            .channel('public:bins')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bins' }, (payload: any) => {
                console.log('Realtime update:', payload);
                fetchBins(); // Refresh all on any change (simple & robust)
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
        */
    }, []);

    // Initial Geolocate
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setCenter([latitude, longitude]);
                    setZoom(14);
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (err) => {
                    console.error("Location access denied/failed, using Bhopal default", err);
                }
            );
        }
    }, []);

    // Filter Logic
    useEffect(() => {
        if (!selectedType) {
            setDisplayBins(bins);
        } else {
            setDisplayBins(bins.filter(b => b.accepts.includes(selectedType)));
        }
    }, [selectedType, bins]);

    // Handle clicking a bin from the list
    const focusBin = (bin: SimulatedBin) => {
        setActiveBinId(bin.id);
        setCenter([bin.lat, bin.lng]);
        setZoom(16); // Closer zoom when focusing
        setIsExpanded(false); // Collapse on selection
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 relative overflow-hidden">

            {/* Header / Back Button (Mobile Only) */}
            <div className="md:hidden absolute top-0 left-0 right-0 z-30 p-4 pointer-events-none">
                <Link href="/" className="pointer-events-auto inline-flex items-center text-slate-700 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-slate-200">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="text-sm font-bold">Back</span>
                </Link>
            </div>

            {/* Real Map (Leaflet) */}
            <div className="absolute inset-0 z-0">
                <CityMap
                    center={center}
                    zoom={zoom}
                    bins={displayBins} // Pass filtered bins
                    activeBinId={activeBinId}
                    onBinClick={focusBin}
                    userLocation={userLocation}
                />
            </div>

            {/* Sidebar / Bottom Sheet Overlay */}
            <div className="absolute inset-x-0 bottom-0 md:top-0 md:bottom-0 md:left-0 md:right-auto md:w-[450px] z-20 pointer-events-none flex flex-col justify-end md:justify-start h-full md:h-auto">

                {/* Desktop Background Blob (Visual only) */}
                <div className="hidden md:block absolute top-[-20%] left-[-20%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10" />

                {/* Mobile: Dynamic Height Sheet (starts at 40%), Desktop: Full Height */}
                <div
                    className={cn("bg-white/90 md:bg-white/80 backdrop-blur-xl md:backdrop-blur-2xl w-full md:h-full rounded-t-[2.5rem] md:rounded-r-[2.5rem] md:rounded-l-none shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-2xl border border-white/50 md:border-white/20 flex flex-col overflow-hidden pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isExpanded ? "h-[85vh]" : "h-[40vh]", // Explicit mobile height states
                        "md:h-full" // Desktop always full
                    )}>

                    {/* Mobile Handle */}
                    <div
                        className="md:hidden w-full flex justify-center pt-3 pb-1 cursor-pointer active:scale-95 transition-transform"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
                    </div>

                    {/* Header Section */}
                    <div className="px-6 py-6 md:p-8 flex-shrink-0 bg-white/60 backdrop-blur-md z-20 border-b border-slate-100/50">
                        <div className="hidden md:flex items-center gap-4 mb-8">
                            <Link href="/" className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors group">
                                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Find Bins</h1>
                                <p className="text-slate-500 text-sm font-medium">Locate recycling points near you</p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by area or bin..."
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Filter Items</h3>
                                {selectedType && (
                                    <button onClick={() => setSelectedType(null)} className="text-xs font-bold text-primary hover:text-primary/70 bg-primary/5 px-3 py-1 rounded-full transition-colors">
                                        Reset
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x -mx-6 px-6 md:mx-0 md:px-1">
                                {WASTE_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                                        className={cn(
                                            "flex flex-col items-center flex-shrink-0 snap-start transition-all duration-300 group",
                                            selectedType === type.id ? "opacity-100 scale-105" : selectedType ? "opacity-50 hover:opacity-100 hover:scale-105" : "opacity-100 hover:scale-105"
                                        )}
                                    >
                                        <div className={cn("w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] flex items-center justify-center mb-2 transition-all shadow-sm border",
                                            selectedType === type.id
                                                ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20"
                                                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-500"
                                        )}>
                                            <type.icon className={cn("w-6 h-6 md:w-7 md:h-7 transition-colors", selectedType !== type.id && type.color)} />
                                        </div>
                                        <span className={cn("text-[11px] font-bold transition-colors",
                                            selectedType === type.id ? "text-slate-900" : "text-slate-500"
                                        )}>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-32 md:pb-8 no-scrollbar space-y-5 bg-slate-50/50">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sticky top-0 bg-slate-50/95 backdrop-blur-sm py-4 z-10 flex justify-between items-center border-b border-slate-200/50">
                            <span>Nearby Locations</span>
                            <span className="bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full shadow-sm">{displayBins.length}</span>
                        </div>

                        {displayBins.map((bin, idx) => (
                            <div
                                key={bin.id}
                                onMouseEnter={() => {
                                    if (activeBinId !== bin.id) setActiveBinId(bin.id);
                                }}
                                onClick={() => focusBin(bin)}
                                className={cn("group relative bg-white border p-5 rounded-[2rem] transition-all duration-300 cursor-pointer overflow-hidden",
                                    activeBinId === bin.id
                                        ? "border-primary/60 shadow-xl shadow-primary/10 ring-4 ring-primary/5 translate-y-[-2px]"
                                        : "border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 hover:translate-y-[-1px]"
                                )}
                            >
                                {/* Active Indicator Strip */}
                                {activeBinId === bin.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />}

                                <div className="flex items-start justify-between mb-4 pl-2">
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <h4 className="font-bold text-lg text-slate-900 leading-tight">{bin.name}</h4>
                                            {bin.status === 'full' && (
                                                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold border border-red-200 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> FULL
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                {/* Distance Calculation approximate */}
                                                <span>
                                                    {userLocation
                                                        ? (Math.abs(bin.lat - userLocation.lat) * 111).toFixed(1) + ' km away'
                                                        : 'Nearby'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn("flex flex-col items-end gap-1",
                                        bin.fill_percent > 80 ? "text-red-500" : "text-emerald-500"
                                    )}>
                                        <span className="text-2xl font-black leading-none">{bin.fill_percent}%</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Capacity</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 pl-2">
                                    <div className="flex -space-x-2">
                                        {bin.accepts.map((item: string, i: number) => (
                                            <div key={i} className="h-8 w-8 rounded-full ring-2 ring-white bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm z-0 hover:z-10 hover:scale-110 transition-transform bg-white" title={item}>
                                                {item[0].toUpperCase()}
                                            </div>
                                        )).slice(0, 4)}
                                        {bin.accepts.length > 4 && (
                                            <div className="h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                +{bin.accepts.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Direct Navigation - Google Maps */}
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="z-10"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all">
                                                <Compass className="w-5 h-5" />
                                            </button>
                                        </a>

                                        {/* Link to Detail Page */}
                                        <Link href={`/bin/${bin.id}`} className="z-10" onClick={(e) => e.stopPropagation()}>
                                            <button className="bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-primary transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95">
                                                Details
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function RecycleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
            <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
            <path d="m14 16-3 3 3 3" />
            <path d="M8.293 13.596 7.196 9.5 3.1 7" />
            <path d="m18 13-1.5-7.5L2 2" />
            <path d="m20+21-3-3 3-3" />
        </svg>
    )
}
