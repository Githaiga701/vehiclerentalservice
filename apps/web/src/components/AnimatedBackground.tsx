"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  variant?: "dots" | "grid" | "waves" | "gradient" | "mesh";
  className?: string;
  children?: React.ReactNode;
}

export default function AnimatedBackground({ 
  variant = "gradient", 
  className,
  children 
}: AnimatedBackgroundProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const backgroundPatterns = {
    dots: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[size:20px_20px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(147,51,234,0.1)_1px,transparent_0)] bg-[size:30px_30px] animate-pulse delay-1000"></div>
      </div>
    ),
    
    grid: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.05)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse delay-500"></div>
      </div>
    ),
    
    waves: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute -bottom-20 -right-40 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float delay-3000"></div>
      </div>
    ),
    
    gradient: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-cyan-50/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent"></div>
      </div>
    ),
    
    mesh: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-600/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.02)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
      </div>
    )
  };

  return (
    <div className={cn("relative", className)}>
      {backgroundPatterns[variant]}
      
      {/* Animated overlay elements */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}>
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse delay-0"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400/20 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-pulse delay-3000"></div>
      </div>
      
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}