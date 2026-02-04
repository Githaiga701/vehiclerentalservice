"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  ArrowUp, 
  Search,
  Heart,
  Share2,
  X,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actions = [
    {
      icon: MessageCircle,
      label: "Chat Support",
      action: () => {
        // Open chat widget or redirect to WhatsApp
        window.open('https://wa.me/254700000000', '_blank');
      },
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Phone,
      label: "Call Us",
      action: () => {
        window.location.href = 'tel:+254700000000';
      },
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Mail,
      label: "Email",
      action: () => {
        window.location.href = 'mailto:support@vehiclerent.ke';
      },
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: Search,
      label: "Quick Search",
      action: () => {
        document.getElementById('search-input')?.focus();
      },
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <>
      {/* Main FAB */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Action Buttons */}
        <div className={cn(
          "flex flex-col gap-3 transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"
        )}>
          {actions.map((action, index) => (
            <div
              key={action.label}
              className={cn(
                "flex items-center gap-3 transition-all duration-300",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Label */}
              <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-white/20 text-sm font-medium text-slate-700 whitespace-nowrap">
                {action.label}
              </div>
              
              {/* Button */}
              <Button
                size="sm"
                className={cn(
                  "rounded-full w-12 h-12 p-0 shadow-lg border-0 text-white transition-all duration-300 hover:scale-110",
                  action.color
                )}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
              >
                <action.icon className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Main Toggle Button */}
        <Button
          size="lg"
          className={cn(
            "rounded-full w-16 h-16 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl border-0 text-white transition-all duration-300 hover:scale-110",
            isOpen && "rotate-45"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            size="sm"
            className="rounded-full w-12 h-12 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-white/20 text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-110"
            onClick={scrollToTop}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}