# Local Deals & Coupon App

A React Native Expo app with Firebase Authentication and Firestore for a local deals marketplace.

## What’s included

- Email/password authentication
- Customer and business account roles
- Nearby deals discovery with search and category filters
- Favorite deals support
- Deal details and coupon redemption flow
- Business deal posting and listing management
- Firestore security rules to protect user and business data

## Folder structure

- `App.tsx` — root app entry
- `src/context/AuthContext.tsx` — auth state, signup/login/logout
- `src/lib/firebase.ts` — Firebase initialization
- `src/navigation/` — app navigation flows
- `src/screens/` — feature screens
- `src/components/DealCard.tsx` — reusable deal card component
- `firestore.rules` — Firestore security rules

## Firebase setup

1. Create a Firebase project.
2. Enable Authentication > Email/Password.
3. Enable Firestore.
4. Replace the placeholder config in `src/lib/firebase.ts` with your Firebase values.
5. Deploy rules with:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Run the app

```bash
npm install
npm start
```

## Notes

- Business accounts can post offers and manage listings.
- User accounts can browse deals, save favorites, and redeem coupons.
- Firestore collections used: `users`, `deals`, `favorites`, `redeemedCoupons`.

## Firestore security rules

- Users can read all deals.
- Users can only create/read/update/delete their own user document.
- Businesses can only create/manage deals they created.
- Favorites and redeemed coupons can only be created/read by the current user.
