import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Have questions? We&apos;d love to hear from you. Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-card/50 border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Call Us</h3>
            <p className="text-sm text-muted-foreground">+91 820 018 7929</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Email Us</h3>
            <p className="text-sm text-muted-foreground">phonepointsilvassa@gmail.com</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Visit Us</h3>
            <div className="text-sm text-muted-foreground leading-relaxed">
              Shop no. 5, prem gali,<br />
              opp. jain temple, char rasta,<br />
              Silvassa, Dadra and Nagar Haveli,<br />
              396230
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Business Hours</h3>
            <p className="text-sm text-muted-foreground">Mon-Sat: 10AM - 8PM</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Prefer to Chat?</h2>
          <p className="text-muted-foreground mb-4">
            Use our in-app messaging feature to chat with our team directly.
            We typically respond within a few hours.
          </p>
          <p className="text-xs text-muted-foreground">
            Click the <MessageCircle className="inline h-3 w-3" /> icon in the navigation bar to start a conversation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
