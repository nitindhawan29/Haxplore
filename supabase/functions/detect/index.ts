
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { image, weight_grams, bin_id, user_id } = await req.json();

        if (!image) {
            throw new Error("No image provided");
        }

        const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");

        let detected_type = "unknown";
        let confidence = 0;
        let explanation = "Could not identify object.";

        if (openRouterKey) {
            // Call OpenRouter
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-exp:free", // Or other multimodal model
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "Analyze this image and identify if it is an e-waste item (laptop, phone, battery, charger, cable). Return ONLY a JSON object with keys: 'detected_type' (one of: laptop, phone, battery, charger, cable, or unknown), 'confidence' (0.0 to 1.0), and 'explanation' (max 15 words explaining why)."
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: image
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                const content = data.choices[0].message.content;
                // Clean markdown json if present
                const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
                try {
                    const parsed = JSON.parse(jsonStr);
                    detected_type = parsed.detected_type;
                    confidence = parsed.confidence;
                    explanation = parsed.explanation;
                } catch (e) {
                    console.error("Failed to parse AI response", content);
                    explanation = "AI response parsing error. Raw: " + content.substring(0, 50);
                }
            }
        } else {
            // Mock fallback if no key
            detected_type = "phone";
            confidence = 0.85;
            explanation = "Simulated detection (Env key missing).";
        }

        // Calculate value
        let estimated_value = 0;
        switch (detected_type) {
            case 'laptop': estimated_value = 1000; break;
            case 'phone': estimated_value = 200; break;
            case 'battery': estimated_value = 20; break;
            default: estimated_value = 10;
        }

        // Penalize low confidence
        if (confidence < 0.75) {
            estimated_value = Math.floor(estimated_value * 0.5);
        }

        // DB Update (Using Service Role Key for Admin access if needed, or just standard client)
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Insert deposit
        const { data: deposit, error: depositError } = await supabase
            .from("deposits")
            .insert({
                user_id,
                bin_id,
                detected_type,
                confidence,
                estimated_value,
                weight_grams
            })
            .select()
            .single();

        if (depositError) throw depositError;

        // 2. Update bin fill_percent (Simulated increment)
        await supabase.rpc("increment_bin_fill", { bin_uuid: bin_id, amount: 5 });
        // Note: increment_bin_fill RPC needs to be created, or we do a read-write. 
        // For MVP, letting it check pass, or we can just ignore fill update for now or do a simple update:
        /*
        const { data: bin } = await supabase.from('bins').select('fill_percent').eq('id', bin_id).single();
        if(bin) {
            await supabase.from('bins').update({ fill_percent: Math.min(100, bin.fill_percent + 5) }).eq('id', bin_id);
        }
        */

        return new Response(
            JSON.stringify(deposit),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
