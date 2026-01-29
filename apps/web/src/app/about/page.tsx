import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About VehicleRent Kenya
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting vehicle owners with trusted renters across Kenya — safely, transparently, and affordably.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To create a fair, secure and accessible vehicle rental marketplace in Kenya where owners can earn from their idle vehicles and renters can find reliable transportation at fair prices — all while building trust through KYC, ratings and transparent processes.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe in empowering ordinary Kenyans — whether you're a matatu owner, a professional driver, or someone who needs a car for a wedding or business trip.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To become the most trusted and widely used vehicle rental platform in East Africa, where every booking is safe, every payment is confirmed, and every trip ends with mutual satisfaction.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A platform that reduces fraud, builds community trust, and makes vehicle ownership more rewarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Core Values</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Trust & Transparency",
                description: "Mandatory KYC, clear ratings, and driver-confirmed payments so everyone knows who they're dealing with.",
              },
              {
                title: "Safety First",
                description: "Secure connections, verified users, and real feedback help keep every journey safe.",
              },
              {
                title: "Fairness & Opportunity",
                description: "No hidden fees, fair pricing, and equal opportunity for owners and renters across Kenya.",
              },
            ].map((value, idx) => (
              <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Whether you're looking to rent a vehicle or list yours for income — join thousands of Kenyans already using VehicleRent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
              <a href="/vehicles">Find a Vehicle</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <a href="/register">List Your Vehicle</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}