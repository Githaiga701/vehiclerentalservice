"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Car, LogIn, LogOut, User, BookOpen, Shield, Settings, Users, BarChart3 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const { user, logout, isAdmin, isOwner } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await logout();
    // Optionally redirect
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Car className="h-7 w-7" />
          <span>VehicleRent</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(item.href) ? "text-primary font-semibold" : "text-slate-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth / User Area */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookings" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                </DropdownMenuItem>
                {isOwner && (
                  <DropdownMenuItem asChild>
                    <Link href="/owner/dashboard" className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>Owner Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                      Admin Panel
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/kyc-approvals" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>KYC Approvals</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Manage Users</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/vehicles" className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span>Manage Vehicles</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/reports" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>Reports</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-10">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold text-primary"
                onClick={() => setOpen(false)}
              >
                <Car className="h-8 w-8" /> VehicleRent
              </Link>

              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg font-medium",
                      isActive(item.href) ? "text-primary font-semibold" : "text-slate-700"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 mt-8">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-3 bg-neutral-100 rounded-lg">
                      <Avatar>
                        <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <Button variant="outline" asChild onClick={() => setOpen(false)}>
                      <Link href="/profile">Profile</Link>
                    </Button>
                    <Button variant="outline" asChild onClick={() => setOpen(false)}>
                      <Link href="/bookings">My Bookings</Link>
                    </Button>
                    {isOwner && (
                      <Button variant="outline" asChild onClick={() => setOpen(false)}>
                        <Link href="/owner/dashboard">Owner Dashboard</Link>
                      </Button>
                    )}
                    {isAdmin && (
                      <>
                        <div className="border-t pt-3 mt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Admin Panel</p>
                          <Button variant="outline" asChild onClick={() => setOpen(false)} className="w-full mb-2">
                            <Link href="/admin/dashboard">
                              <Shield className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </Button>
                          <Button variant="outline" asChild onClick={() => setOpen(false)} className="w-full mb-2">
                            <Link href="/kyc-approvals">
                              <Settings className="mr-2 h-4 w-4" />
                              KYC Approvals
                            </Link>
                          </Button>
                          <Button variant="outline" asChild onClick={() => setOpen(false)} className="w-full">
                            <Link href="/admin/users">
                              <Users className="mr-2 h-4 w-4" />
                              Manage Users
                            </Link>
                          </Button>
                          <Button variant="outline" asChild onClick={() => setOpen(false)} className="w-full">
                            <Link href="/admin/vehicles">
                              <Car className="mr-2 h-4 w-4" />
                              Manage Vehicles
                            </Link>
                          </Button>
                          <Button variant="outline" asChild onClick={() => setOpen(false)} className="w-full">
                            <Link href="/admin/reports">
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Reports
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                    <Button variant="destructive" onClick={() => { handleLogout(); setOpen(false); }}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild onClick={() => setOpen(false)}>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button className="bg-accent hover:bg-accent/90" asChild onClick={() => setOpen(false)}>
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
