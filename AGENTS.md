# Willa Handmade Studio — Agent Knowledge Base

## Knowledge Log

### 2026-03-05 — Opening Hours Admin Portal

- **Problem:** Website owner had to manually send opening hours each month to update the hardcoded `Hours.tsx` component.
- **Solution:** Added a Firebase-backed admin portal (`/admin`) with authentication, monthly hour editing, and automatic public display of upcoming 30 days on the homepage.
- **Key files:** `src/lib/firebase.ts`, `src/pages/Admin.tsx`, `src/components/Hours.tsx`, `src/App.tsx`
- **Stack:** React + Vite + TypeScript + Tailwind CSS + Shadcn UI + Firebase (Firestore + Auth)
- **Notes:** Firebase config is read from `VITE_FIREBASE_*` env vars (see `.env.example`). All UI text is in Dutch. No Firebase Hosting — site is hosted on Vimexx.
- **Firestore Rules:** The `openingHours` collection needs `allow read: if true` (public) and `allow write: if request.auth != null` (admin only). Default Firestore rules deny all access — must be updated in Firebase Console > Firestore > Rules.

### 2026-05-01 — Pricing Update

- **Problem:** Needed to update the pricing for shortening pants ("broeken inkorten") and change it from a starting price to a fixed price.
- **Solution:** Updated `src/components/Pricing.tsx` to reflect the fixed price of €15,00 for "Broeken inkorten".
- **Key files:** `src/components/Pricing.tsx`
