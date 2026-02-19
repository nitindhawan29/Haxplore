# Testing E-Waste AI Recognition

Quick guide to test your OpenRouter AI integration.

## Quick Start

1. **Set up your API key** (if not done):
   ```bash
   # Add to .env.local
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

2. **Restart dev server**:
   ```bash
   npm run dev
   ```

3. **Test with sample images**:
   - Take photos of old electronics
   - Upload through your app's detection interface
   - Check the AI response

## Expected Response Format

```json
{
  "detected_type": "laptop",
  "confidence": 0.95,
  "explanation": "MacBook Pro laptop with aluminum body",
  "recyclable_materials": ["aluminum", "plastic", "lithium", "glass"],
  "condition": "good",
  "estimated_value": 1800
}
```

## Testing Different Items

### High-Value Items
- Old laptops (expected: 1500-1800 points)
- Smartphones (expected: 300-360 points)
- Monitors (expected: 200-240 points)

### Medium-Value Items
- Printers (expected: 100-120 points)
- Circuit boards (expected: 50-60 points)
- Chargers (expected: 30-36 points)

### Low-Value Items
- Keyboards (expected: 25-30 points)
- Mice (expected: 15-18 points)
- Batteries (expected: 15-18 points)
- Cables (expected: 10-12 points)

## Value Calculation

Base value × Condition multiplier × Confidence multiplier

**Condition multipliers:**
- Good: 1.2x
- Fair: 1.0x
- Poor: 0.6x

**Confidence multipliers:**
- ≥ 0.75: 1.0x
- < 0.75: 0.5x

## Common Test Scenarios

### Scenario 1: Clear Image
- Upload: Clear photo of laptop
- Expected: High confidence (>0.9), accurate type, good condition

### Scenario 2: Poor Lighting
- Upload: Dark/blurry image
- Expected: Lower confidence (0.6-0.8), may still detect correctly

### Scenario 3: Multiple Items
- Upload: Photo with multiple devices
- Expected: AI focuses on most prominent item

### Scenario 4: Non-E-Waste
- Upload: Photo of furniture/food
- Expected: detected_type = "unknown", low confidence

## Debugging

### Check API Response
Look at browser console or server logs for:
```
OpenRouter Error: [error details]
```

### Verify API Call
Check that the request includes:
- Valid Authorization header
- Base64 encoded image
- Proper model name
- Complete prompt

### Test Without AI
Remove `OPENROUTER_API_KEY` from `.env.local` to test fallback mode.

## Performance Tips

- **Image size**: Keep under 5MB for faster processing
- **Format**: JPEG/PNG work best
- **Resolution**: 800x600 to 1920x1080 is optimal
- **Background**: Plain backgrounds improve accuracy

## Rate Limits (Free Tier)

- ~200 requests per day
- ~20 requests per minute
- Resets daily

For production, consider:
- Implementing request caching
- Adding rate limiting on your end
- Upgrading to paid tier
