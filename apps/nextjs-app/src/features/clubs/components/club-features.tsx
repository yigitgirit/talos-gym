import Image from "next/image";
import { Star, Dumbbell, Clock, Waves, Fingerprint, UserCheck, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Map string icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  "clock-fast": Clock,
  "dumbbell": Dumbbell,
  "waves": Waves,
  "fingerprint": Fingerprint,
  "user-check": UserCheck,
  "car": Car,
};

// Mock data as requested
const valueProposition = {
  highlights: [
    { id: "h1", label: "24/7 Access", icon: "clock-fast" },
    { id: "h2", label: "Premium Equipment", icon: "dumbbell" },
    { id: "h3", label: "Olympic Pool", icon: "waves" },
    { id: "h4", label: "Advanced Biometrics", icon: "fingerprint" },
    { id: "h5", label: "Professional Coaching", icon: "user-check" },
    { id: "h6", label: "Free Private Parking", icon: "car" }
  ],
  amenities: [
    { 
      category: "Comfort", 
      items: ["Free High-Speed Wi-Fi", "Modern Locker Rooms", "Premium Towel Service"],
      imageUrl: "/pexels-huum-sauna-heaters-718199222-36077589.jpg"
    },
    { 
      category: "Recovery", 
      items: ["Infrared Sauna", "Cold Plunge", "Steam Room"],
      imageUrl: "/pexels-huum-sauna-heaters-718199222-36420271.jpg"
    },
    { 
      category: "Lifestyle", 
      items: ["Protein & Juice Bar", "Coworking Lounge", "Device Charging Stations"],
      imageUrl: "/pexels-woom-fitness-2155946557-33966785.jpg"
    }
  ]
};

export function ClubFeatures() {
  return (
    <section className="w-full py-12 md:py-16 bg-muted/20 border-b border-border">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-center mb-8 md:mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Why Choose TalosGym</h2>
        </div>
        
        {/* Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-10 md:mb-12">
          {valueProposition.highlights.map((highlight) => {
            const IconComponent = iconMap[highlight.icon] || Star;
            return (
              <div 
                key={highlight.id} 
                className="group flex flex-col items-center justify-center p-3 md:p-4 bg-background rounded-xl border border-border/50 text-center gap-2 md:gap-3 transition-all duration-200 hover:bg-muted/50 hover:shadow-md hover:scale-105"
              >
                <div className="p-2 md:p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <span className="font-medium text-xs md:text-sm">{highlight.label}</span>
              </div>
            );
          })}
        </div>

        {/* Amenities Grid */}
        <div>
          <h3 className="font-heading text-lg md:text-xl font-bold mb-6 md:mb-8">Amenities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {valueProposition.amenities.map((amenityGroup, index) => (
              <Card key={index} className="pt-0 bg-background overflow-hidden flex flex-col">
                <div className="relative h-100 md:h-150 w-full shrink-0">
                  <Image
                    src={amenityGroup.imageUrl}
                    alt={amenityGroup.category}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">{amenityGroup.category}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 md:space-y-2.5">
                    {amenityGroup.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-muted-foreground">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}