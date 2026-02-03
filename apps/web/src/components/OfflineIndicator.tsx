"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-hide the offline message after coming back online
  useEffect(() => {
    if (isOnline && showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-16 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className={`border shadow-lg transition-all duration-300 ${
        isOnline 
          ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
          : 'border-orange-200 bg-gradient-to-r from-orange-50 to-red-50'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isOnline ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-orange-600" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                isOnline ? 'text-green-900' : 'text-orange-900'
              }`}>
                {isOnline ? 'Back Online!' : 'You\'re Offline'}
              </p>
              <p className={`text-xs ${
                isOnline ? 'text-green-600' : 'text-orange-600'
              }`}>
                {isOnline 
                  ? 'Connection restored. All features available.' 
                  : 'Some features may be limited. Check your connection.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}