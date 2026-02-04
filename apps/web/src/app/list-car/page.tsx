"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Upload, 
  MapPin, 
  DollarSign, 
  Calendar,
  Users,
  Fuel,
  Settings,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera,
  FileText,
  Shield,
  Clock,
  Star,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

const VEHICLE_CATEGORIES = [
  { value: "Sedan", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "Hatchback", label: "Hatchback" },
  { value: "Coupe", label: "Coupe" },
  { value: "Convertible", label: "Convertible" },
  { value: "Pickup", label: "Pickup Truck" },
  { value: "Van", label: "Van" },
  { value: "Luxury", label: "Luxury" },
];

const FUEL_TYPES = [
  { value: "Petrol", label: "Petrol" },
  { value: "Diesel", label: "Diesel" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Electric", label: "Electric" },
];

const TRANSMISSION_TYPES = [
  { value: "Manual", label: "Manual" },
  { value: "Automatic", label: "Automatic" },
];

const FEATURES = [
  "Air Conditioning", "GPS Navigation", "Bluetooth", "USB Charging",
  "Backup Camera", "Parking Sensors", "Sunroof", "Leather Seats",
  "Heated Seats", "Cruise Control", "Keyless Entry", "Push Start",
  "Premium Sound", "Apple CarPlay", "Android Auto", "WiFi Hotspot",
  "Lane Assist", "Blind Spot Monitor", "Adaptive Cruise", "360 Camera"
];

interface VehicleFormData {
  // Basic Info
  make: string;
  model: string;
  year: number;
  category: string;
  
  // Technical Details
  transmission: string;
  fuelType: string;
  seats: number;
  engineSize: string;
  mileage: number;
  
  // Pricing & Availability
  dailyPrice: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  
  // Location
  location: string;
  address: string;
  
  // Description & Features
  description: string;
  features: string[];
  
  // Documents & Images
  images: File[];
  documents: File[];
}

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Tell us about your vehicle",
    icon: Car
  },
  {
    id: 2,
    title: "Technical Details",
    description: "Specifications and features",
    icon: Settings
  },
  {
    id: 3,
    title: "Pricing & Location",
    description: "Set your rates and location",
    icon: DollarSign
  },
  {
    id: 4,
    title: "Photos & Documents",
    description: "Upload images and paperwork",
    icon: Camera
  },
  {
    id: 5,
    title: "Review & Submit",
    description: "Confirm your listing",
    icon: CheckCircle2
  }
];

export default function ListCarPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const [formData, setFormData] = useState<VehicleFormData>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    category: "",
    transmission: "",
    fuelType: "",
    seats: 5,
    engineSize: "",
    mileage: 0,
    dailyPrice: 0,
    weeklyDiscount: 0,
    monthlyDiscount: 0,
    location: "",
    address: "",
    description: "",
    features: [],
    images: [],
    documents: []
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const updateFormData = (field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.make && formData.model && formData.year && formData.category);
      case 2:
        return !!(formData.transmission && formData.fuelType && formData.seats);
      case 3:
        return !!(formData.dailyPrice && formData.location);
      case 4:
        return formData.images.length >= 3;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add vehicle data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'documents') {
          if (Array.isArray(value)) {
            submitData.append(key, JSON.stringify(value));
          } else {
            submitData.append(key, value.toString());
          }
        }
      });

      // Add images
      formData.images.forEach((image, index) => {
        submitData.append(`images`, image);
      });

      // Add documents
      formData.documents.forEach((doc, index) => {
        submitData.append(`documents`, doc);
      });

      await apiClient.addVehicle(submitData);
      
      toast.success("Vehicle listed successfully! It will be reviewed and approved shortly.");
      router.push("/owner/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to list vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={cn(
            "transition-all duration-1000 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/20 hover:bg-white/10 backdrop-blur-sm px-6 py-2">
              <Car className="w-4 h-4 mr-2" />
              Become a Host
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white leading-tight">
              List Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Vehicle
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Turn your car into a source of income. Join thousands of vehicle owners earning money on our platform.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                  currentStep >= step.id 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "bg-white border-gray-300 text-gray-400"
                )}>
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-4 transition-all duration-300",
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-slate-600 mt-2">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="make">Vehicle Make *</Label>
                      <Input
                        id="make"
                        placeholder="e.g., Toyota, BMW, Mercedes"
                        value={formData.make}
                        onChange={(e) => updateFormData("make", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">Vehicle Model *</Label>
                      <Input
                        id="model"
                        placeholder="e.g., Camry, X5, C-Class"
                        value={formData.model}
                        onChange={(e) => updateFormData("model", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        type="number"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        value={formData.year}
                        onChange={(e) => updateFormData("year", parseInt(e.target.value))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {VEHICLE_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Technical Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="transmission">Transmission *</Label>
                      <Select value={formData.transmission} onValueChange={(value) => updateFormData("transmission", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRANSMISSION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fuelType">Fuel Type *</Label>
                      <Select value={formData.fuelType} onValueChange={(value) => updateFormData("fuelType", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          {FUEL_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="seats">Number of Seats *</Label>
                      <Input
                        id="seats"
                        type="number"
                        min="2"
                        max="15"
                        value={formData.seats}
                        onChange={(e) => updateFormData("seats", parseInt(e.target.value))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="engineSize">Engine Size</Label>
                      <Input
                        id="engineSize"
                        placeholder="e.g., 2.0L, 3.5L"
                        value={formData.engineSize}
                        onChange={(e) => updateFormData("engineSize", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mileage">Mileage (km)</Label>
                      <Input
                        id="mileage"
                        type="number"
                        min="0"
                        value={formData.mileage}
                        onChange={(e) => updateFormData("mileage", parseInt(e.target.value))}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Features</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      {FEATURES.map((feature) => (
                        <div
                          key={feature}
                          onClick={() => toggleFeature(feature)}
                          className={cn(
                            "p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm text-center",
                            formData.features.includes(feature)
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing & Location */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="dailyPrice">Daily Rate (KSh) *</Label>
                        <Input
                          id="dailyPrice"
                          type="number"
                          min="0"
                          value={formData.dailyPrice}
                          onChange={(e) => updateFormData("dailyPrice", parseInt(e.target.value))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weeklyDiscount">Weekly Discount (%)</Label>
                        <Input
                          id="weeklyDiscount"
                          type="number"
                          min="0"
                          max="50"
                          value={formData.weeklyDiscount}
                          onChange={(e) => updateFormData("weeklyDiscount", parseInt(e.target.value))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthlyDiscount">Monthly Discount (%)</Label>
                        <Input
                          id="monthlyDiscount"
                          type="number"
                          min="0"
                          max="50"
                          value={formData.monthlyDiscount}
                          onChange={(e) => updateFormData("monthlyDiscount", parseInt(e.target.value))}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-300 my-6" />

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Location
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="location">City/Area *</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Nairobi, Mombasa, Kisumu"
                          value={formData.location}
                          onChange={(e) => updateFormData("location", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Full Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter the pickup address for your vehicle"
                          value={formData.address}
                          onChange={(e) => updateFormData("address", e.target.value)}
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-300 my-6" />

                  <div>
                    <Label htmlFor="description">Vehicle Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your vehicle, its condition, and any special features..."
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Photos & Documents */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Vehicle Photos (Minimum 3 required) *
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Click to upload photos
                        </p>
                        <p className="text-sm text-gray-500">
                          Upload high-quality photos of your vehicle (Max 10 images)
                        </p>
                      </label>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Vehicle ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-full h-px bg-gray-300 my-8" />

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Documents (Optional)
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload}
                        className="hidden"
                        id="document-upload"
                      />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          Upload vehicle documents
                        </p>
                        <p className="text-xs text-gray-500">
                          Registration, insurance, inspection certificates
                        </p>
                      </label>
                    </div>

                    {formData.documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{doc.name}</span>
                            <button
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Review Your Listing
                    </h3>
                    <p className="text-gray-600">
                      Please review all information before submitting
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Vehicle Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Vehicle:</span> {formData.make} {formData.model} ({formData.year})</p>
                        <p><span className="font-medium">Category:</span> {formData.category}</p>
                        <p><span className="font-medium">Transmission:</span> {formData.transmission}</p>
                        <p><span className="font-medium">Fuel Type:</span> {formData.fuelType}</p>
                        <p><span className="font-medium">Seats:</span> {formData.seats}</p>
                        <p><span className="font-medium">Daily Rate:</span> KSh {formData.dailyPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Location & Features</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Location:</span> {formData.location}</p>
                        <p><span className="font-medium">Features:</span> {formData.features.length} selected</p>
                        <p><span className="font-medium">Photos:</span> {formData.images.length} uploaded</p>
                        <p><span className="font-medium">Documents:</span> {formData.documents.length} uploaded</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Your listing will be reviewed by our team</li>
                          <li>• We'll verify your vehicle information and documents</li>
                          <li>• You'll receive approval notification within 24-48 hours</li>
                          <li>• Once approved, your vehicle will be live on the platform</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                {currentStep < 5 ? (
                  <Button
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Listing</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why List Your Vehicle With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Earn Extra Income",
                description: "Turn your idle vehicle into a source of passive income"
              },
              {
                icon: Shield,
                title: "Full Protection",
                description: "Comprehensive insurance coverage for all rentals"
              },
              {
                icon: Clock,
                title: "Flexible Schedule",
                description: "You control when your vehicle is available for rent"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <benefit.icon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}