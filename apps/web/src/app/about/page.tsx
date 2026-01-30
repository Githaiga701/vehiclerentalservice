"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Users, 
  Car, 
  Shield, 
  Heart,
  Target,
  TrendingUp,
  Globe,
  CheckCircle,
  Star,
  Zap
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: Car, value: "500+", label: "Vehicles" },
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: Award, value: "4.9/5", label: "Average Rating" },
    { icon: Globe, value: "15+", label: "Locations" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Your safety is our priority. All vehicles are fully insured and regularly maintained to the highest standards.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "We're committed to providing exceptional service and support at every step of your rental journey.",
    },
    {
      icon: Target,
      title: "Quality Assurance",
      description: "Every vehicle undergoes rigorous inspection and maintenance to ensure reliability and comfort.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously improve our platform and services to provide the best car rental experience.",
    },
  ];

  const milestones = [
    { year: "2018", title: "Company Founded", description: "Started with a vision to revolutionize car rentals in Kenya" },
    { year: "2019", title: "100 Vehicles", description: "Expanded our fleet to serve more customers across Nairobi" },
    { year: "2021", title: "National Coverage", description: "Extended services to major cities across Kenya" },
    { year: "2023", title: "10K+ Customers", description: "Reached milestone of serving over 10,000 satisfied customers" },
    { year: "2024", title: "500+ Fleet", description: "Grew to become Kenya's largest car rental platform" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-white/30">
              <Star className="w-3 h-3 mr-1" />
              Kenya's #1 Car Rental Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Our Journey
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              We're on a mission to make car rentals simple, affordable, and accessible 
              for everyone across Kenya. Join thousands of satisfied customers who trust us 
              for their transportation needs.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white -mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, idx) => (
              <Card key={idx} className="border-none shadow-lg hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Our Story
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Driving Innovation in Car Rentals
              </h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Founded in 2018, we started with a simple idea: make car rentals in Kenya 
                easier, more transparent, and more affordable. What began as a small operation 
                with just a handful of vehicles has grown into Kenya's most trusted car rental platform.
              </p>
              
              <p className="text-lg leading-relaxed">
                Today, we serve thousands of customers across the country, from business travelers 
                and tourists to families planning their next adventure. Our commitment to quality, 
                safety, and customer satisfaction has made us the go-to choice for car rentals in Kenya.
              </p>

              <p className="text-lg leading-relaxed">
                We believe that everyone deserves access to reliable, well-maintained vehicles 
                at fair prices. That's why we've built a platform that combines cutting-edge 
                technology with personalized service, ensuring every rental experience is smooth 
                and hassle-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20">
              <Zap className="w-3 h-3 mr-1" />
              Our Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Drives Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do, from selecting vehicles to serving customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, idx) => (
              <Card key={idx} className="border-none shadow-lg hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary hover:bg-secondary/20">
              Our Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Milestones & Achievements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A timeline of our growth and success over the years
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {milestone.year}
                    </div>
                    {idx < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-accent to-primary mt-2" />
                    )}
                  </div>
                  <Card className="flex-1 border-none shadow-lg hover-lift mb-8">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-success/10 text-success hover:bg-success/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Why Choose Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                The Best Choice for Your Journey
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Largest fleet of well-maintained vehicles",
                "Competitive pricing with no hidden fees",
                "24/7 customer support and roadside assistance",
                "Comprehensive insurance coverage",
                "Flexible pickup and drop-off locations",
                "Easy online booking process",
                "Regular vehicle maintenance and safety checks",
                "Experienced and professional team",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers and book your perfect vehicle today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-accent hover:bg-white/90 text-lg px-8 py-6" asChild>
              <a href="/vehicles">Browse Vehicles</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
