import { Clock } from "lucide-react";

const hours = [
  { days: "4 Nov", time: "9:00 tot 17:00" },
  { days: "11 Nov", time: "9:00 tot 17:00" },
  { days: "12 Nov", time: "9:00 tot 18:00" },
  { days: "13 Nov", time: "9:00 tot 17:00" },
  { days: "18 Nov", time: "9:00 tot 17:00" },
  { days: "19 Nov", time: "9:00 tot 13:00" },
  { days: "20 Nov", time: "9:00 tot 17:00" },
  { days: "25 Nov", time: "9:00 tot 17:00" },
  { days: "26 Nov", time: "9:00 tot 15:30" },
  { days: "27 Nov", time: "9:00 tot 17:00" },
  { days: "29 Nov", time: "9:00 tot 18:00" },
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
