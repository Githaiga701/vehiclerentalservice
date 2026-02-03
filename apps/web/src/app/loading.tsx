import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen-mobile flex items-center justify-center bg-gradient-hero">
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary/20 mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Loading VehicleRent</h2>
          <p className="text-sm text-muted-foreground">Please wait while we prepare your experience</p>
        </div>
      </div>
    </div>
  );
}