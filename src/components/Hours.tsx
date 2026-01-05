import { Clock } from "lucide-react";
import atelierTriptych from "@/assets/atelier-triptych.png";

const hours = [
  { days: "6 januari", time: "9:00 tot 18:00" },
  { days: "7 januari", time: "9:00 tot 18:00" },
  { days: "8 januari", time: "9:00 tot 17:30" },
  { days: "13 januari", time: "9:00 tot 17:30" },
  { days: "14 januari", time: "9:00 tot 17:00" },
  { days: "15 januari", time: "9:00 tot 17:30" },
  { days: "20 januari", time: "9:00 tot 17:30" },
  { days: "21 januari", time: "9:00 tot 18:00" },
  { days: "22 januari", time: "9:00 tot 17:30" },
  { days: "27 januari", time: "9:00 tot 17:30" },
  { days: "28 januari", time: "9:30 tot 18:00" },
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
              Ook open op afspraak: 06-25393938
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-xl overflow-hidden border-4 border-accent">
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

        {/* Triptych Image */}
        <div className="mt-12">
          <img 
            src={atelierTriptych} 
            alt="Atelier impressies - garens, naaien en stoffen" 
            className="w-full rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hours;
