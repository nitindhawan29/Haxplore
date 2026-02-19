import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Client (Normally use @supabase/auth-helpers-nextjs or similar in real app)
// For this MVP, we might rely on env vars or just use the public client for read-only if RLS allows
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const type = searchParams.get('type');

    try {
        let query = supabase.from('bins').select('*').neq('status', 'maintenance');

        // Filter by type if provided
        if (type) {
            query = query.contains('accepts', [type]);
        }

        const { data: bins, error } = await query;

        if (error) throw error;

        // Simple distance calculation (Haversine not strictly needed for MVP logic if we just return all, 
        // but we can sort in JS)
        const sortedBins = bins.map(bin => {
            const dist = Math.sqrt(Math.pow(bin.lat - lat, 2) + Math.pow(bin.lng - lng, 2)); // Euclidean approx for small area
            return { ...bin, distance: dist };
        }).sort((a, b) => a.distance - b.distance);

        return NextResponse.json(sortedBins);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
