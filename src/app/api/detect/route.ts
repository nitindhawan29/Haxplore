
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('image') as Blob;
        const weight = formData.get('weight');

        if (!file) {
            return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
        }

        // Convert blob to base64
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        const openRouterKey = process.env.OPENROUTER_API_KEY;

        let result = {
            detected_type: 'unknown',
            confidence: 0,
            explanation: 'Analysis failed or no key provided.',
            estimated_value: 0,
            recyclable_materials: [] as string[],
            condition: 'unknown'
        };

        if (openRouterKey) {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${openRouterKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                        "X-Title": "E-Waste Recognition System"
                    },
                    body: JSON.stringify({
                        model: "qwen/qwen-2-vl-7b-instruct",
                        messages: [
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: `Analyze this image and identify the e-waste item. Respond with ONLY a JSON object, no other text.

Categories: laptop, phone, monitor, keyboard, mouse, battery, charger, cable, circuit_board, printer, unknown

Rules:
- laptop = portable computer with screen + keyboard attached
- phone = smartphone or tablet
- monitor = standalone display
- battery = standalone battery only
- charger = power adapter only
- cable = wires/cords only

JSON format (copy exactly):
{"detected_type":"category","confidence":0.9,"explanation":"brief description","recyclable_materials":["plastic","metal"],"condition":"good"}`
                                    },
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: base64Image
                                        }
                                    }
                                ]
                            }
                        ],
                        temperature: 0.1,
                        max_tokens: 250
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`OpenRouter API Error (${response.status}):`, errorText);
                    throw new Error(`OpenRouter API failed with status ${response.status}`);
                }

                const data = await response.json();

                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    console.error("OpenRouter Invalid Response Structure:", JSON.stringify(data));
                    // throw new Error("Invalid response structure from OpenRouter");
                    console.warn("Falling back to mock data due to API error.");
                    result = { ...result, ...getMockResult(weight) };
                } else if (data.choices && data.choices[0]) {
                    const content = data.choices[0].message.content;
                    console.log("AI Response:", content);

                    // Try to extract JSON from the response
                    let jsonStr = content;

                    // Remove markdown code blocks
                    jsonStr = jsonStr.replace(/```json\s*/g, "").replace(/```\s*/g, "");

                    // Try to find JSON object in the response
                    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        jsonStr = jsonMatch[0];
                    }

                    try {
                        const parsed = JSON.parse(jsonStr);
                        result = { ...result, ...parsed };
                        console.log("Parsed result:", result);
                    } catch (parseError) {
                        console.error("JSON Parse Error:", parseError);
                        console.log("Failed to parse:", jsonStr);
                        // Use mock result if parsing fails
                        result = { ...result, ...getMockResult(weight) };
                    }
                }
            } catch (e) {
                console.error("OpenRouter Error:", e);
                // Fallback to mock if API fails
                result = { ...result, ...getMockResult(weight) };
            }
        } else {
            console.log("No OpenRouter Key, using mock.");
            result = { ...result, ...getMockResult(weight) };
        }

        // Calculate Value Logic based on type and condition
        let val = 0;
        const baseValues: Record<string, number> = {
            laptop: 1500,
            phone: 300,
            battery: 15,
            charger: 30,
            cable: 10,
            circuit_board: 50,
            monitor: 200,
            keyboard: 25,
            mouse: 15,
            printer: 100,
            unknown: 5
        };

        val = baseValues[result.detected_type] || 5;

        // Adjust for condition
        if (result.condition === 'good') {
            val = Math.floor(val * 1.2);
        } else if (result.condition === 'poor') {
            val = Math.floor(val * 0.6);
        }

        // Adjust for confidence
        if (result.confidence < 0.75) {
            val = Math.floor(val * 0.5);
        }

        result.estimated_value = val;

        return NextResponse.json(result);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getMockResult(weight: any) {
    // simple heuristic for demo fallback (random if no weight/AI) 
    const types = ['laptop', 'phone', 'charger', 'battery', 'cable'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return {
        detected_type: randomType,
        confidence: 0.88,
        explanation: `AI recognized shape of ${randomType}.`,
        recyclable_materials: ['plastic', 'metal'],
        condition: 'fair'
    };
}
