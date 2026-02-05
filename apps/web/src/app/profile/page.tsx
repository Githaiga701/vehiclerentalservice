"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiClient, handleApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Edit
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      await apiClient.updateProfile(editForm);
      toast.success("Profile updated successfully");
      setIsEditDialogOpen(false);
      // Refresh user data
      await refreshUser();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return CheckCircle2;
      case "PENDING":
        return Clock;
      case "REJECTED":
        return XCircle;
      default:
        return Shield;
    }
  };

  const KycIcon = getKycStatusIcon(user.kycStatus || "");

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your basic account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">
                        {user.role}
                      </Badge>
                      {user.trustScore && (
                        <Badge variant="secondary">
                          Trust Score: {user.trustScore.score}/5.0
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number</span>
                    </div>
                    <p className="font-medium">{user.phone}</p>
                  </div>

                  {user.email && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>Email Address</span>
                      </div>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Member Since</span>
                    </div>
                    <p className="font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Account Type</span>
                    </div>
                    <p className="font-medium capitalize">{user.role?.toLowerCase()}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" onClick={handleEditProfile}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* KYC Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>
                  Your KYC (Know Your Customer) verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getKycStatusColor(user.kycStatus || "")}`}>
                      <KycIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        KYC Status: {user.kycStatus || "Not Started"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.kycStatus === "APPROVED" && "Your identity has been verified"}
                        {user.kycStatus === "PENDING" && "Your documents are being reviewed"}
                        {user.kycStatus === "REJECTED" && "Please resubmit your documents"}
                        {!user.kycStatus && "Complete KYC to unlock all features"}
                      </p>
                    </div>
                  </div>
                  {!user.kycStatus && (
                    <Button onClick={() => router.push("/kyc")}>
                      Start KYC
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/bookings")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  My Bookings
                </Button>
                
                {user.role === "OWNER" && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push("/owner/dashboard")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Owner Dashboard
                  </Button>
                )}
                
                {user.role === "ADMIN" && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push("/admin/dashboard")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/vehicles")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Browse Vehicles
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trust Score</span>
                  <span className="font-medium">{user.trustScore?.score || "N/A"}</span>
                </div>
                {user.role === "OWNER" && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Vehicles Listed</span>
                    <span className="font-medium">0</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}