"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import LocationPicker from "@/components/LocationPicker";

// Zod schema for KYC
const kycSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  nationalId: z.string().min(8, "Valid ID number required"),
  address: z.string().min(5, "Address is required"),
  idFront: z.instanceof(File).refine((file) => file.size < 5 * 1024 * 1024, "File too large (max 5MB)"),
  idBack: z.instanceof(File).refine((file) => file.size < 5 * 1024 * 1024, "File too large"),
  selfie: z.instanceof(File).refine((file) => file.size < 5 * 1024 * 1024, "File too large"),
});

type KycForm = z.infer<typeof kycSchema>;

export default function KycPage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    city: string;
  } | null>(null);

  const form = useForm<KycForm>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      fullName: "",
      nationalId: "",
      address: "",
    },
  });

  const onSubmit = async (data: KycForm) => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("nationalId", data.nationalId);
      formData.append("address", selectedLocation?.address || data.address);
      formData.append("city", selectedLocation?.city || "");
      formData.append("latitude", selectedLocation?.lat.toString() || "");
      formData.append("longitude", selectedLocation?.lng.toString() || "");
      formData.append("idFront", data.idFront);
      formData.append("idBack", data.idBack);
      formData.append("selfie", data.selfie);

      await apiClient.submitKyc(formData);
      
      // Update user KYC status in context
      updateUser({ kycStatus: "PENDING" });
      
      // Redirect to success page
      router.push("/");
    } catch (error: any) {
      setSubmitError(error.message || "Failed to submit KYC. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Complete KYC Verification</CardTitle>
          <p className="text-muted-foreground">
            Required to book or list vehicles. Your data is secure.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name (as in ID)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID / Passport Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Address / Location</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input 
                          {...field} 
                          placeholder="e.g. Westlands, Nairobi"
                          value={selectedLocation?.address || field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            if (!selectedLocation) {
                              // If no location selected via map, use text input
                            }
                          }}
                        />
                        <div className="border rounded-lg p-4">
                          <Label className="text-sm font-medium mb-2 block">
                            Or pick your location on the map:
                          </Label>
                          <LocationPicker
                            onLocationSelect={(location) => {
                              setSelectedLocation(location);
                              field.onChange(location.address);
                            }}
                            initialLocation={selectedLocation || undefined}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="idFront"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>ID Front (Upload photo)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idBack"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>ID Back (Upload photo)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="selfie"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Selfie (hold ID next to face if possible)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitError && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {submitError}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit KYC
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}