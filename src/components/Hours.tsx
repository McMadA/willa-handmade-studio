import { Clock } from "lucide-react";

const hours = [
  { days: "Maandag - Vrijdag", time: "9:00 - 17:00" },
  { days: "Zaterdag", time: "10:00 - 14:00" },
  { days: "Zondag", time: "Gesloten" },
];

const Hours = () => {
  return (
    <section id="openingstijden" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Openingstijden
            </h2>
            <p className="font-poppins text-xl text-muted-foreground">
              Graag op afspraak voor persoonlijk advies
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
            <div className="divide-y divide-border">
              {hours.map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-6 hover:bg-muted/50 transition-colors duration-200"
                >
                  <span className="font-poppins text-lg text-foreground font-medium">
                    {item.days}
                  </span>
                  <span className="font-poppins text-lg text-primary font-semibold">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hours;
