"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarPicker } from "@/components/CalendarPicker";
import LocationPicker from "@/components/LocationPicker";
import { 
  AlertCircle, 
  Loader2, 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard,
  User,
  Phone,
  MessageSquare
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const bookingSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  pickupTime: z.string().min(1, "Pickup time is required"),
  returnTime: z.string().min(1, "Return time is required"),
  driverName: z.string().min(2, "Driver name is required"),
  driverPhone: z.string().min(10, "Valid phone number is required"),
  driverLicense: z.string().min(5, "Driver license number is required"),
  specialRequests: z.string().optional(),
  needsDelivery: z.boolean().default(false),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface EnhancedBookingFormProps {
  vehicleId: string;
  vehicleName: string;
  dailyPrice: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EnhancedBookingForm({
  vehicleId,
  vehicleName,
  dailyPrice,
  onSuccess,
  onCancel,
}: EnhancedBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [pickupLocation, setPickupLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    city: string;
  } | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    city: string;
  } | null>(null);

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickupTime: "09:00",
      returnTime: "18:00",
      driverName: "",
      driverPhone: "",
      driverLicense: "",
      specialRequests: "",
      needsDelivery: false,
      agreedToTerms: false,
    },
  });

  const watchedDates = form.watch(["startDate", "endDate"]);
  const watchedDelivery = form.watch("needsDelivery");

  // Calculate total price
  const calculateTotal = () => {
    const [startDate, endDate] = watchedDates;
    if (!startDate || !endDate) return 0;
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = days * dailyPrice;
    const deliveryFee = watchedDelivery ? 2000 : 0; // KSh 2000 delivery fee
    
    return basePrice + deliveryFee;
  };

  const onSubmit = async (data: BookingForm) => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const bookingData = {
        vehicleId,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        pickupTime: data.pickupTime,
        returnTime: data.returnTime,
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        driverLicense: data.driverLicense,
        specialRequests: data.specialRequests,
        needsDelivery: data.needsDelivery,
        pickupLocation: pickupLocation,
        dropoffLocation: dropoffLocation,
        totalPrice: calculateTotal(),
      };

      await apiClient.createBooking(bookingData);
      
      toast.success("Booking request submitted successfully!");
      onSuccess?.();
    } catch (error: any) {
      setSubmitError(error.message || "Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = calculateTotal();
  const days = watchedDates[0] && watchedDates[1] 
    ? Math.ceil((watchedDates[1].getTime() - watchedDates[0].getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Book {vehicleName}</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Fill in the details below to request this vehicle
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Date</FormLabel>
                    <FormControl>
                      <CalendarPicker
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="Select pickup date"
                        minDate={new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Date</FormLabel>
                    <FormControl>
                      <CalendarPicker
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="Select return date"
                        minDate={watchedDates[0] || new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickupTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Time</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Time</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Driver Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Driver Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="driverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="driverPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+254712345678" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="driverLicense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver License Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="DL123456789" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Delivery Option */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="needsDelivery"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Vehicle Delivery Service (+KSh 2,000)
                      </FormLabel>
                      <p className="text-sm text-gray-600">
                        Have the vehicle delivered to your preferred location
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Location Selection */}
            {watchedDelivery && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Delivery Locations</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Pickup Location
                    </Label>
                    <LocationPicker
                      onLocationSelect={setPickupLocation}
                      initialLocation={pickupLocation || undefined}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Drop-off Location
                    </Label>
                    <LocationPicker
                      onLocationSelect={setDropoffLocation}
                      initialLocation={dropoffLocation || undefined}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Special Requests */}
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Special Requests (Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Any special requirements or requests..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Summary */}
            {days > 0 && (
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Price Summary</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vehicle rental ({days} days)</span>
                      <span>KSh {(days * dailyPrice).toLocaleString()}</span>
                    </div>
                    {watchedDelivery && (
                      <div className="flex justify-between">
                        <span>Delivery service</span>
                        <span>KSh 2,000</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>KSh {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Terms Agreement */}
            <FormField
              control={form.control}
              name="agreedToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the terms and conditions
                    </FormLabel>
                    <p className="text-sm text-gray-600">
                      By checking this box, you agree to our rental terms, cancellation policy, and privacy policy.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{submitError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary hover:opacity-90"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Submit Booking Request
                  </>
                )}
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}