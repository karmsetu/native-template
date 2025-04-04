Using **Zustand** in a **React Native Expo** project is straightforward and efficient for state management. Here's a **step-by-step guide** with best practices:

---

### **1. Install Zustand**

```bash
expo install zustand
# or with npm/yarn/bun
npm install zustand
```

---

### **2. Create a Store**

Create a store file (e.g., `store/useCounterStore.ts`):

```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the store's type
type CounterStore = {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
};

// Create the store with persistence
export const useCounterStore = create<CounterStore>()(
    persist(
        (set) => ({
            count: 0,
            increment: () => set((state) => ({ count: state.count + 1 })),
            decrement: () => set((state) => ({ count: state.count - 1 })),
            reset: () => set({ count: 0 }),
        }),
        {
            name: 'counter-storage', // Key for AsyncStorage
            storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage
        }
    )
);
```

---

### **3. Use the Store in Components**

Example usage in a screen (`screens/CounterScreen.tsx`):

```tsx
import { View, Text, Button } from 'react-native';
import { useCounterStore } from '../store/useCounterStore';

export function CounterScreen() {
    const { count, increment, decrement, reset } = useCounterStore();

    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
            <Text className="text-2xl dark:text-white">Count: {count}</Text>
            <View className="flex-row gap-2 mt-4">
                <Button title="Increment" onPress={increment} />
                <Button title="Decrement" onPress={decrement} />
                <Button title="Reset" onPress={reset} />
            </View>
        </View>
    );
}
```

---

### **4. Best Practices**

#### **A. State Slices Pattern**

Split complex stores into slices:

```tsx
// store/useAuthStore.ts
type AuthState = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

export const useAuthStore = create<AuthState>(/* ... */);
```

#### **B. Persistence with AsyncStorage**

For persisted state (like auth tokens):

```tsx
persist(
    (set) => ({
        /* ... */
    }),
    {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ user: state.user }), // Only persist user data
    }
);
```

#### **C. Optimize Rerenders**

Select specific state to avoid unnecessary rerenders:

```tsx
const user = useAuthStore((state) => state.user); // Only rerenders when user changes
```

---

### **5. Advanced Usage**

#### **A. Combine Stores**

```tsx
// store/rootStore.ts
import { createCounterStore } from './useCounterStore';
import { createAuthStore } from './useAuthStore';

export const useRootStore = () => ({
    counter: useCounterStore(),
    auth: useAuthStore(),
});
```

#### **B. Middleware (Logging)**

```tsx
import { devtools } from 'zustand/middleware';

const useStore = create<StoreType>()(
    devtools(persist(/* ... */), { name: 'MyStore' })
);
```

#### **C. Async Actions**

```tsx
const useStore = create((set) => ({
    data: null,
    fetchData: async () => {
        const response = await fetch('...');
        set({ data: await response.json() });
    },
}));
```

---

### **6. TypeScript Support**

For full type safety:

```tsx
// store/types.ts
export type User = {
    id: string;
    name: string;
    email: string;
};

interface StoreState {
    user: User | null;
    // ...
}
```

---

### **7. Cleanup on Unmount**

Zustand automatically handles cleanup, but for subscriptions:

```tsx
useEffect(() => {
    const unsubscribe = useStore.subscribe(
        (state) => state.user,
        (user) => console.log('User changed:', user)
    );
    return () => unsubscribe();
}, []);
```

---

### **Example: Auth Flow Implementation**

```tsx
// store/useAuthStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password) => {
        const user = await authService.login(email, password);
        set({ user });
      },
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage', storage: /* ... */ }
  )
);

// Usage in component
const { user, login } = useAuthStore();
```

---

### **Key Benefits in React Native**

1. **No Context Provider Needed** – Avoids prop drilling
2. **Optimized Renders** – Components only update when their used state changes
3. **Persistence Built-in** – Easy AsyncStorage integration
4. **Small Bundle Size** – ~1kB (compared to Redux)

---

### **Troubleshooting**

-   **"Invalid hook call"**: Ensure you're calling `useStore` only in components/hooks
-   **AsyncStorage issues**: Check Expo's [AsyncStorage docs](https://docs.expo.dev/versions/latest/sdk/async-storage/)
-   **Type errors**: Verify your store types with `create<YourType>()()`

Would you like me to show how to integrate this with React Navigation (e.g., protected routes based on Zustand auth state)?
