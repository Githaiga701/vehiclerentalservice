"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
            <div className="w-full h-px bg-gray-300" />
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

        {/* Development Note - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center font-medium mb-1">
              🧪 Development Mode - Test Accounts
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <p><strong>Regular User:</strong> +254712345678</p>
              <p><strong>Owner:</strong> +254723456789</p>
              <p><strong>Admin:</strong> +254700000000</p>
              <p><strong>OTP:</strong> Any 6-digit code (e.g., 123456)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}