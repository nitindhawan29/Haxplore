# How to Get Google Credentials (The Easy Way)

If you can't find the menus in Google Cloud Console, use the **Search Bar**.

## 1. Go to the Console
Open [console.cloud.google.com](https://console.cloud.google.com/).

## 2. Use the Search Bar (Top Center)
1.  Click the Search bar at the very top of the page.
2.  Type **"Credentials"**.
3.  Click on the result that says **"Credentials"** with the subtitle **"APIs & Services"**.

## 3. Create the Credentials
Once you are on the Credentials page:
1.  Click **+ CREATE CREDENTIALS** (top of the list).
2.  Select **OAuth client ID**.
    *   *If it forces you to "Configure Consent Screen" first:*
        *   Choose **External**.
        *   Type "EcoSmart" as the App Name.
        *   Add your email for user support/developer contact.
        *   Click "Save and Continue" 3 times.
        *   Go back to **Credentials** via the Search Bar.
3.  **Application type**: Choose **Web application**.
4.  **Name**: "Supabase Login".

## 4. The Most Important Part (Redirect URI)
1.  Scroll down to **Authorized redirect URIs**.
2.  Click **ADD URI**.
3.  Paste this exact URL (from your Supabase):
    `https://vaextquiciqfwlfzvdgt.supabase.co/auth/v1/callback`
4.  Click **CREATE**.

## 5. Copy the Keys
It will show a popup.
*   **Your Client ID** -> Copy to Supabase.
*   **Your Client Secret** -> Copy to Supabase.

---
**Note:** If Google Cloud is still too hard, Supabase also has **Email Magic Links** enabled by default. We can switch to that if you prefer, but the above steps are the standard way for Google Sign-In.
