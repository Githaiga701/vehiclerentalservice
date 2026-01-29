"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { auth, setupRecaptcha } from "@/lib/firebase";
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState("+254"); // Kenyan prefix
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isAdmin, setIsAdmin] = useState(false); // Dev testing flag

  useEffect(() => {
    // Setup invisible reCAPTCHA
    setupRecaptcha("recaptcha-container");
  }, []);

  const sendOtp = async () => {
    setError("");
    setIsLoading(true);

    try {
      const appVerifier = window.recaptchaVerifier as RecaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (!confirmationResult) throw new Error("No OTP request found");
      const credential = await confirmationResult.confirm(otp);

      // User is signed in!
      const user = credential.user;
      const userData = {
        id: user.uid,
        name: user.displayName || "User",
        email: user.email || "",
        phone: user.phoneNumber || "",
        isAdmin: isAdmin, // Dev testing flag
      };

      await login(userData); // Update our auth context
      router.push("/kyc"); // Redirect to KYC if not done
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4">
      <div id="recaptcha-container" className="hidden" /> {/* reCAPTCHA anchor */}

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {step === "phone" ? "Sign in with Phone" : "Enter OTP"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === "phone"
              ? "We'll send a one-time code to your phone"
              : `Code sent to ${phone}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Kenyan numbers start with +254 or 07
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                <input
                  type="checkbox"
                  id="admin-toggle"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="admin-toggle" className="text-sm cursor-pointer mb-0">
                  Login as Admin (dev testing)
                </Label>
              </div>

              <Button onClick={sendOtp} className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={verifyOtp} className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                >
                  Resend code
                </Button>
              </div>
            </>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}