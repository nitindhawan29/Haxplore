# EcoSmart Demo Script (5 Minutes)

**Role**: Presenter (User & Admin)
**Goal**: Showcase the seamless flow from finding a bin to getting rewarded.

---

### **0:00 - 0:45 | Introduction & Problem**
*   **Scene**: Show Slide 1 (Title/Vision).
*   **Voice**: "Good morning. E-waste is the fastest-growing waste stream, yet 80% of it ends up in landfills because recycling is inconvenient and opaque. Meet EcoSmart."
*   **Action**: Switch to **Landing Page** (localhost:3000).
*   **Voice**: "EcoSmart is a PWA that transforms recycling into a rewarding, verifiable action."

### **0:45 - 1:30 | The Finder Experience**
*   **Action**: Click **Find Nearest Bin**.
*   **UI**: Show map with markers and bottom sheet.
*   **Voice**: "First, I need to recycle this old phone. I filter by 'Phone'. The app instantly shows me the nearest *operational* bins. I see 'Community Center Bin' is full, so I'll go to 'MG Road Bin'."
*   **Action**: Tap "MG Road Bin" -> Tap navigate icon (Simulate walking).

### **1:30 - 2:45 | The "Smart Bin" Interaction**
*   **Action**: Navigate to `/bin/1` (Simulating the screen on the physical bin).
*   **Voice**: "I'm now at the smart bin. It has a screen showing a dynamic QR code."
*   **Action**: Click **Tap to Scan QR**.
*   **UI**: Transition to **Connected** state -> Redirect to **Deposit Page**.
*   **Voice**: "My phone instantly connects via the QR scan. No login friction."

### **2:45 - 3:45 | AI Detection & Deposit**
*   **UI**: Show Deposit Page.
*   **Voice**: "I place my phone in the bin and take a picture."
*   **Action**: Upload a picture of a phone. Click **Analyze Item**.
*   **Voice**: "Our multimodal AI analyzes the object in real-time using just the camera. It identifies the type and estimates value."
*   **UI**: Show 'Analyzing' spinner -> Show Result Card.
*   **Voice**: "It correctly identifies a 'Smartphone' and estimates a value of ₹200. I get immediate transparency."
*   **Action**: Click **Confirm**. Show 'Success' animation.

### **3:45 - 4:15 | Rewards & Impact**
*   **Action**: Click **View Wallet** (Goes to Profile).
*   **UI**: Show Points (increased) and CO2 Saved.
*   **Voice**: "I instantly see my reward. 20 Points added. 0.3kg CO2 saved. This instant feedback loop drives habit formation."

### **4:15 - 5:00 | Admin & Closure**
*   **Action**: Switch to `/admin`.
*   **Voice**: "For the city, our Admin Dashboard tracks bin fill levels in real-time."
*   **Action**: Click **Optimize Route**.
*   **UI**: Show alert "Route Optimized".
*   **Voice**: "We optimize collection routes to save fuel, reducing operational costs by 30%. EcoSmart makes recycling easy for users and efficient for cities."
*   **Scene**: End on Slide 5 (Call to Action).

---
**Key Interactions to Practice**:
1.  Smoothing the transition between "Bin Screen" and "User Phone" (Browser Tabs).
2.  Uploading a photo quickly.
