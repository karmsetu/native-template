import { create } from 'zustand';

// Define the store's type
type StoreType = {};

// Create the store with persistence
export const useStore = create<StoreType>();
