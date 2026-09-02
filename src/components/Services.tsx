import { Scissors, Palette, Sparkles, Heart } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Kledingreparatie",
    description: "Van eenvoudige naadwerkjes tot complexe herstelklussen, ik maak jouw kleding weer als nieuw."
  },
  {
    icon: Palette,
    title: "Custom Kleding & Upcycling",
    description: "Geef oude kledingstukken nieuw leven met creatieve aanpassingen en unieke designs."
  },
  {
    icon: Sparkles,
    title: "Borduren",
    description: "Verfraai je kleding met handgemaakte borduursels, namen, initialen of decoratieve motieven."
  },
  {
    icon: Heart,
    title: "Patches & Details",
    description: "Voeg persoonlijkheid toe met op maat gemaakte patches en decoratieve details."
  }
];

const Services = () => {
  return (
    <section id="diensten" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Wat ik voor je kan doen
          </h2>
          <p className="font-poppins text-xl text-muted-foreground max-w-2xl mx-auto">
            Ambachtelijke diensten met aandacht voor detail en kwaliteit
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-4 border-accent"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-playfair text-2xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="font-poppins text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Banner linking to Naailes */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-card rounded-2xl border-2 border-accent/50 shadow-md">
            <span className="font-poppins text-foreground text-base md:text-lg font-medium">
              Wil je liever zelf leren naaien, kleding vermaken of patronen leren maken?
            </span>
            <a
              href="#naailes"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-poppins text-sm font-medium hover:opacity-90 transition-all hover:scale-105 shadow-sm shrink-0"
            >
              <span>Bekijk de Naailessen</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
