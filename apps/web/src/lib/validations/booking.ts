import { z } from "zod";

export const bookingSchema = z.object({
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
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type BookingFormData = z.infer<typeof bookingSchema>;