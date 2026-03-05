import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { getUpcomingOpeningHours, type DailyHours } from "@/lib/firebase";
import atelierTriptych from "@/assets/atelier-triptych.png";

const MONTH_NAMES_NL = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"
];

const DAY_NAMES_NL = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

const Hours = () => {
  const [hours, setHours] = useState<DailyHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const data = await getUpcomingOpeningHours();
        setHours(data);
      } catch (err) {
        console.error("Error fetching opening hours:", err);
        setError(true);
      }
      setLoading(false);
    };
    fetchHours();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayName = DAY_NAMES_NL[date.getDay()];
    const dayNum = date.getDate();
    const month = MONTH_NAMES_NL[date.getMonth()];
    return `${dayName} ${dayNum} ${month}`;
  };

  // Filter to only show open days
  const openDays = hours.filter((h) => h.isOpen);

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
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="font-poppins text-muted-foreground">
                  Kon openingstijden niet laden. Probeer het later opnieuw.
                </p>
              </div>
            ) : openDays.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-poppins text-muted-foreground">
                  Er zijn momenteel geen openingstijden ingepland. Neem contact op voor een afspraak.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {openDays.map((item, index) => {
                  // Check if there is a month gap between this item and the previous
                  const prevMonth = index > 0 ? new Date(openDays[index - 1].date).getMonth() : null;
                  const currentMonth = new Date(item.date).getMonth();
                  const showSpacer = prevMonth !== null && prevMonth !== currentMonth;

                  return (
                    <div key={item.date}>
                      {showSpacer && <div className="h-4 bg-muted/30" />}
                      <div className="flex justify-between items-center p-6 hover:bg-muted/50 transition-colors duration-200">
                        <span className="font-poppins text-lg text-foreground font-medium capitalize">
                          {formatDate(item.date)}
                        </span>
                        <span className="font-poppins text-lg text-primary font-semibold">
                          {item.openTime} tot {item.closeTime}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
