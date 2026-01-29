// src/components/layout/Footer.tsx
import Link from "next/link";
import { Car } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <Car className="h-6 w-6" />
              VehicleRent
            </Link>
            <p className="text-sm text-muted-foreground">
              Reliable vehicle rentals across Kenya. Drive your way.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/vehicles">Browse Vehicles</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/list-car">List Your Car</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Vehicle Rental Service. All rights reserved.
        </div>
      </div>
    </footer>
  );
}