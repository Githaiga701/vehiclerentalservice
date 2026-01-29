"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextType = {
  value: string | undefined;
  setValue: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export function Tabs({ value, defaultValue, onValueChange, children, className }: any) {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const current = value ?? internal;
  const setValue = (v: string) => {
    if (onValueChange) onValueChange(v);
    if (value === undefined) setInternal(v);
  };

  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={cn("", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  );
}

export function TabsTrigger({ className, value, children, ...props }: any) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium",
        active ? "bg-primary text-white" : "bg-white text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: any) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  if (ctx.value !== value) return null;
  return <div className={cn("", className)}>{children}</div>;
}

export default Tabs;
