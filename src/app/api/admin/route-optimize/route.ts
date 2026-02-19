import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
    try {
        const { data: bins, error } = await supabase
            .from('bins')
            .select('*')
            .gt('fill_percent', 50) // Only look at >50% full
            .order('fill_percent', { ascending: false });

        if (error) throw error;

        // Simple greedy optimization: Just return them in order of fullness for MVP
        // A real implementation would simulate TSP or similar.

        return NextResponse.json({
            optimized_route: bins,
            total_stops: bins.length
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
