"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get("code");
            const next = searchParams.get("next") || "/profile";

            if (code) {
                try {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) {
                        console.error("Auth callback error:", error);
                        router.push("/?error=auth_failed");
                    } else {
                        router.push(next);
                    }
                } catch (err) {
                    console.error("Auth callback exception:", err);
                    router.push("/?error=auth_option_failed");
                }
            } else {
                // No code, maybe hash fragment or just wrong navigation
                // Supabase might have already handled it if utilizing implicit flow, 
                // but we expect code flow mostly.
                router.push("/");
            }
        };

        handleAuthCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-slate-500 font-medium">Completing secure sign in...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
            <CallbackContent />
        </Suspense>
    );
}
