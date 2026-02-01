"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2, Phone, Shield, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, requestOtp } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const normalizePhone = (phoneNumber: string) => {
    // Remove all non-digits
    const digits = phoneNumber.replace(/\D/g, "");
    
    // Handle Kenyan phone numbers
    if (digits.startsWith("254")) {
      return `+${digits}`;
    } else if (digits.startsWith("0")) {
      return `+254${digits.slice(1)}`;
    } else if (digits.length === 9) {
      return `+254${digits}`;
    }
    
    return `+254${digits}`;
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }

    setIsLoading(true);
    const normalizedPhone = normalizePhone(phone);
    
    const success = await requestOtp(normalizedPhone);
    if (success) {
      setStep("otp");
      setOtpSent(true);
    }
    
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    const normalizedPhone = normalizePhone(phone);
    
    const result = await login(normalizedPhone, otp);
    if (result.success && result.user) {
      // Role-based redirect
      if (result.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (result.user.role === "OWNER") {
        router.push("/owner/dashboard");
      } else {
        router.push("/");
      }
    }
    
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    const normalizedPhone = normalizePhone(phone);
    await requestOtp(normalizedPhone);
    setIsLoading(false);
  };

  // Demo login function for testing
  const quickLogin = async (role: "user" | "admin") => {
    setIsLoading(true);
    
    // Use real phone numbers from the seeded data
    const phoneNumber = role === "admin" ? "+254700000000" : "+254712345678";
    
    // Request OTP first
    const otpSuccess = await requestOtp(phoneNumber);
    if (otpSuccess) {
      setPhone(phoneNumber);
      setStep("otp");
      // Show a message about checking the server console for OTP
      setError("Check the server console for the OTP code");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-primary text-white">
            <Shield className="w-3 h-3 mr-1" />
            Secure Login
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === "phone" ? "Welcome Back" : "Verify Your Phone"}
          </h1>
          <p className="text-gray-600">
            {step === "phone" 
              ? "Enter your phone number to receive an OTP" 
              : "Enter the 6-digit code sent to your phone"
            }
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {step === "phone" ? "Phone Number" : "Verification Code"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "phone" 
                ? "We'll send you a secure OTP to verify your identity"
                : `Code sent to ${phone}`
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Demo Login Buttons */}
            {step === "phone" && (
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-center text-muted-foreground">
                  Quick Demo Login
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => quickLogin("user")}
                    disabled={isLoading}
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <span className="text-sm font-semibold">Demo User</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => quickLogin("admin")}
                    disabled={isLoading}
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-lg">👨‍💼</span>
                    </div>
                    <span className="text-sm font-semibold">Demo Admin</span>
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or login with phone</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {step === "phone" ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0712345678 or +254712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter your Kenyan phone number
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Send OTP
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-lg tracking-widest"
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90" 
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verify & Login
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("phone")}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Change Number
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up here
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Your phone number is encrypted and secure</p>
          <p>We'll never share your personal information</p>
        </div>
      </div>
    </div>
  );
}