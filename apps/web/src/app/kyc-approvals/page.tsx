"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export default function KycApprovalsPage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [kycList, setKycList] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch pending KYC submissions
  useEffect(() => {
    const fetchPendingKyc = async () => {
      if (!isAdmin) return;
      
      setIsLoadingData(true);
      try {
        const pendingKyc = await apiClient.getPendingKyc();
        setKycList(pendingKyc);
      } catch (error: any) {
        console.error("Failed to fetch pending KYC:", error);
        toast.error("Failed to load pending KYC submissions");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isAdmin) {
      fetchPendingKyc();
    }
  }, [isAdmin]);

  const handleApprove = async (userId: string) => {
    setProcessingId(userId);
    try {
      const result = await apiClient.approveKyc(userId);
      
      // Remove from list or update status
      setKycList(prev => prev.filter(item => item.userId !== userId));
      
      toast.success(`KYC approved for ${result.user.name}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to approve KYC");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setProcessingId(userId);
    try {
      const result = await apiClient.rejectKyc(userId);
      
      // Remove from list or update status
      setKycList(prev => prev.filter(item => item.userId !== userId));
      
      toast.success(`KYC rejected for ${result.user.name}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to reject KYC");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : "Loading KYC submissions..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="max-w-md text-center p-8">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            This page is only available to administrators.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <a href="/">Back to Home</a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href="/login">Login as Admin</a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">KYC Approvals</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Review and verify pending user KYC submissions
          </p>
        </div>

        {kycList.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-6" />
              <h3 className="text-2xl font-semibold mb-3">All caught up!</h3>
              <p className="text-muted-foreground text-lg">
                No pending KYC submissions at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {kycList.map((submission) => (
              <Card
                key={submission.userId}
                className={cn(
                  "overflow-hidden border-l-4",
                  submission.status === "approved" ? "border-l-green-500" :
                  submission.status === "rejected" ? "border-l-red-500" :
                  "border-l-amber-500"
                )}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{submission.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{submission.name}</CardTitle>
                        <CardDescription>{submission.phone}</CardDescription>
                      </div>
                    </div>

                    <Badge
                      variant={
                        submission.status === "APPROVED" ? "default" :
                        submission.status === "REJECTED" ? "destructive" : "secondary"
                      }
                      className="text-sm px-4 py-1"
                    >
                      {submission.status === "PENDING" ? "Pending Review" :
                       submission.status === "APPROVED" ? "Approved" : "Rejected"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">National ID</p>
                      <p className="font-medium">{submission.nationalId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">{submission.address}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Submitted</p>
                      <p className="font-medium">{submission.submittedAt}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium mb-3">Uploaded Documents (click to view placeholder)</p>
                    <div className="grid grid-cols-3 gap-3">
                      {submission.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="aspect-video bg-neutral-200 rounded-md flex items-center justify-center text-xs text-muted-foreground hover:bg-neutral-300 cursor-pointer transition-colors"
                        >
                          {doc}
                        </div>
                      ))}
                    </div>
                  </div>

                  {submission.status === "PENDING" && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(submission.userId)}
                        disabled={processingId === submission.userId}
                      >
                        {processingId === submission.userId ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Approve KYC
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(submission.userId)}
                        disabled={processingId === submission.userId}
                      >
                        {processingId === submission.userId ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Reject KYC
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}