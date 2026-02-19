# OpenRouter AI Integration for E-Waste Recognition

This guide explains how to set up and use OpenRouter AI for automatic e-waste image recognition in your application.

## What is OpenRouter?

OpenRouter is a unified API that provides access to multiple AI models including GPT-4, Claude, Gemini, Llama and more. We're using Meta's Llama 3.2 11B Vision model (free) for vision-based e-waste classification.

## ✅ Your API Key is Already Configured!

Your OpenRouter API key has been added to `.env.local` and is ready to use.

Upload an image of e-waste through your app's detection interface. The AI will:
- Identify the type of e-waste
- Provide confidence score
- Explain what it detected
- List recyclable materials
- Assess the item's condition

## Supported E-Waste Categories

The AI can recognize:
- **Laptops**: Notebooks, portable computers
- **Phones**: Smartphones, tablets, mobile devices
- **Batteries**: All battery types (lithium, alkaline, rechargeable)
- **Chargers**: Power adapters, charging bricks
- **Cables**: USB, power cords, HDMI, charging cables
- **Circuit Boards**: PCBs, motherboards, components
- **Monitors**: Computer displays, screens
- **Keyboards**: Computer keyboards, keypads
- **Mice**: Computer mice, trackpads
- **Printers**: Printers, scanners, fax machines

## Current Model: Qwen2-VL 7B Instruct

**Model:** `qwen/qwen-2-vl-7b-instruct`
**Cost:** FREE
**Provider:** Alibaba Cloud (Qwen)
**Strengths:** 
- **Excellent vision capabilities** for object recognition
- 7 billion parameters optimized for visual understanding
- Better accuracy than Llama 3.2 11B Vision for classification tasks
- Strong at distinguishing similar objects (laptop vs tablet, charger vs battery)
- Fast inference speed

**Why We Switched:**
- Llama 3.2 11B Vision was misclassifying items (e.g., laptop → battery)
- Qwen2-VL has superior object detection and classification
- Better at following structured prompts
- More reliable JSON output

## How to Test

1. User uploads an image through the app
2. Image is converted to base64 format
3. Sent to OpenRouter API with Gemini 2.0 Flash model
4. AI analyzes the image and returns:
   - `detected_type`: Category of e-waste
   - `confidence`: 0.0 to 1.0 score
   - `explanation`: Brief description
   - `recyclable_materials`: List of materials
   - `condition`: good/fair/poor
5. System calculates estimated value based on type and condition

## Pricing

- **Qwen2-VL 7B**: FREE (no rate limits)
- No credit card required
- Check [OpenRouter pricing](https://openrouter.ai/docs#models) for other models

## How the Detection Works

If the API key is not configured or the API fails:
- System falls back to mock detection
- Random e-waste type is assigned
- Confidence set to 0.88
- Basic materials list provided

## Troubleshooting

### API Key Not Working
- Verify the key starts with `sk-or-v1-`
- Check for extra spaces in `.env.local`
- Restart your dev server after adding the key

### Low Confidence Scores
- Ensure images are clear and well-lit
- Take photos directly facing the item
- Avoid cluttered backgrounds

### Rate Limiting
- Free tier has rate limits
- Consider upgrading for production use
- Implement caching for repeated images

## Alternative Models

You can switch to other vision models by changing the `model` parameter in `src/app/api/detect/route.ts`:

```typescript
model: "qwen/qwen-2-vl-7b-instruct"              // Current (free, best accuracy)
// model: "meta-llama/llama-3.2-11b-vision-instruct"  // Alternative free option
// model: "qwen/qwen-2-vl-72b-instruct"          // Larger Qwen model (paid, more accurate)
// model: "openai/gpt-4o"                        // Most accurate (paid)
// model: "anthropic/claude-3.5-sonnet"          // Best reasoning (paid)
```

## Fallback Behavior

If the API key is not configured or the API fails:
- System falls back to mock detection
- Random e-waste type is assigned
- Confidence set to 0.88
- Basic materials list provided

## Security Notes

- Never commit `.env.local` to version control
- Keep your API key secret
- Use environment variables in production
- Monitor your API usage on OpenRouter dashboard
