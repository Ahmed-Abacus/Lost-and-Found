"use client";
import { createContext, useState, useContext, ReactNode } from "react";

interface FoundItem {
  id: number;
  item: string;
  description: string;
  location: string;
  category: string;
  dateFound: string;
  contactInfo: string;
  photo?: File | null;
}

interface ItemContextType {
  foundItems: FoundItem[];
  addFoundItem: (item: FoundItem) => void;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function ItemProvider({ children }: { children: ReactNode }) {
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);

  const addFoundItem = (item: FoundItem) => {
    setFoundItems(prev => [item, ...prev]);
  };

  return (
    <ItemContext.Provider value={{ foundItems, addFoundItem }}>
      {children}
    </ItemContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
}
export type { FoundItem };



