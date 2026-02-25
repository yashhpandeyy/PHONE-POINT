import { ShieldCheck, RefreshCw, Award, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Quality Guaranteed",
      description: "Every device undergoes a rigorous 50-point inspection before listing. We ensure you get a phone that looks and works like new."
    },
    {
      icon: RefreshCw,
      title: "Sustainability",
      description: "By choosing second hand, you help reduce e-waste and give devices a second life. Good for your wallet, great for the planet."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Our dedicated support team is always here to help. From purchase to after-sales, we've got you covered."
    }
  ];

  return (
    <div className="container py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">About Phone Point</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
          We are dedicated to providing high-quality, certified second hand phones to give devices a second life and offer you great value.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-16">
        <Card className="bg-gradient-to-br from-card to-accent/10 border-border overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
            <p className="text-foreground/80 leading-relaxed text-lg">
              At Phone Point, we believe premium technology should be accessible to everyone.
              Our mission is to bridge the gap between quality and affordability by offering
              certified second hand smartphones that deliver a like-new experience at a
              fraction of the price.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-8">What Sets Us Apart</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <Card key={value.title} className="bg-card/50 border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
