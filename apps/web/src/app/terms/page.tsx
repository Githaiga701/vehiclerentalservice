export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: February 1, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using VehicleRent Kenya, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Vehicle Rental Services</h2>
              <p className="mb-4">
                VehicleRent Kenya provides a platform connecting vehicle owners with renters. We facilitate bookings but are not responsible for the condition or availability of vehicles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide accurate and complete information during registration</li>
                <li>Complete KYC verification as required</li>
                <li>Use vehicles responsibly and return them in good condition</li>
                <li>Pay all fees and charges as agreed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
              <p className="mb-4">
                All payments must be made through our platform. Cancellation policies vary by vehicle owner and are clearly stated during booking.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="mb-4">
                VehicleRent Kenya is not liable for any damages, accidents, or issues arising from vehicle rentals. Users rent vehicles at their own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms of Service, please contact us at legal@vehiclerent.ke
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}