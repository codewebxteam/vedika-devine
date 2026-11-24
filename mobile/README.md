# Vedika Divine Mobile App 📱

Yeh folder **Vedika Divine** ke mobile application ke liye reserved hai (React Native / Expo).

### Architecture Highlights:
- **Shared Backend**: Saari business logic, Firebase authentication, Firestore models, product fetching, cart management, aur order placing already `../backend` folder me ban chuki hai.
- **Code Reusability**: Mobile app me aapko Firebase ya backend logic dobara likhne ki zaroorat nahi hogi. Aap seedhe `backend` ke services aur types reuse kar sakte hain:
  ```ts
  import { getProducts, loginUser, createOrder } from '../../backend/src';
  ```

### Folder Structure Prepared:
```
mobile/
├── package.json
├── src/
│   ├── navigation/        # Stack & Tab Navigators
│   ├── screens/           # HomeScreen, ShopScreen, ProductDetailScreen, CartScreen, OrdersScreen, ProfileScreen
│   ├── components/        # Mobile UI cards, bottom sheets, headers
│   └── hooks/             # Custom hooks sharing backend logic
└── README.md
```

Jab aap mobile app pe kaam start karenge, aap simply Expo ya React Native CLI initialize karke yahi backend services link kar sakte hain!
