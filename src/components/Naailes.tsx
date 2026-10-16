import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, Mail, Phone, MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { getUpcomingNaailessen, DEFAULT_NAAILES_DAYS, type NaailesDay } from "@/lib/firebase";

const MONTH_NAMES_NL = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

const DAY_NAMES_NL = [
  "Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"
];

interface FormattedLesson {
  date: string;
  day: string;
  dateStr: string;
  monthName: string;
  monthKey: string;
  group: "dinsdag" | "zaterdag" | "overig";
  timeStr: string;
  isCustomTime: boolean;
}

const highlights = [
  "Geschikt voor zowel beginners als gevorderden",
  "Persoonlijke begeleiding in een kleinschalige, gezellige groep",
  "Eigen kledingstukken maken, herstellen of upcyclen",
  "Eigen naaimachine meenemen of werken op een machine van het atelier",
];

// Initial default lessons list to avoid flash of empty content
const getInitialLessons = (): NaailesDay[] => {
  return Object.entries(DEFAULT_NAAILES_DAYS)
    .filter(([_, val]) => val.isLesson)
    .map(([dateStr, val]) => ({
      date: dateStr,
      isLesson: val.isLesson,
      group: val.group,
      startTime: val.startTime,
      endTime: val.endTime,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const Naailes = () => {
  const [lessons, setLessons] = useState<NaailesDay[]>(getInitialLessons);

  useEffect(() => {
    let isMounted = true;
    const loadLessons = async () => {
      try {
        const liveLessons = await getUpcomingNaailessen();
        if (isMounted && liveLessons.length > 0) {
          setLessons(liveLessons);
        }
      } catch (err) {
        console.error("Error loading naailessen in component:", err);
      }
    };
    loadLessons();
    return () => {
      isMounted = false;
    };
  }, []);

  // Format and group lessons
  const { tuesdayGroup, saturdayGroup } = useMemo(() => {
    const now = new Date();
    // Filter from start of current month onwards so active month and future months show
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Filter relevant lessons (or fallback to all lessons if all are in past)
    let activeLessons = lessons.filter((l) => new Date(l.date) >= startOfCurrentMonth);
    if (activeLessons.length === 0) {
      activeLessons = lessons;
    }

    const formatted: FormattedLesson[] = activeLessons.map((l) => {
      const d = new Date(l.date);
      const dayName = DAY_NAMES_NL[d.getDay()];
      const monthName = MONTH_NAMES_NL[d.getMonth()];
      const dayNum = d.getDate();
      const standardTime = l.group === "zaterdag" ? "10:00 – 12:00" : "19:30 – 21:30";
      const customTime = l.startTime && l.endTime ? `${l.startTime} – ${l.endTime}` : standardTime;

      return {
        date: l.date,
        day: dayName,
        dateStr: `${dayNum} ${monthName.toLowerCase()}`,
        monthName,
        monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        group: l.group || (d.getDay() === 6 ? "zaterdag" : "dinsdag"),
        timeStr: customTime,
        isCustomTime: customTime !== standardTime,
      };
    });

    const tLessons = formatted.filter((l) => l.group === "dinsdag" || l.group === "overig");
    const sLessons = formatted.filter((l) => l.group === "zaterdag");

    // Helper to group by month
    const groupByMonth = (items: FormattedLesson[]) => {
      const map = new Map<string, { monthName: string; dates: FormattedLesson[] }>();
      items.forEach((item) => {
        if (!map.has(item.monthKey)) {
          map.set(item.monthKey, { monthName: item.monthName, dates: [] });
        }
        map.get(item.monthKey)!.dates.push(item);
      });
      return Array.from(map.values());
    };

    return {
      tuesdayGroup: {
        lessons: tLessons,
        months: groupByMonth(tLessons),
      },
      saturdayGroup: {
        lessons: sLessons,
        months: groupByMonth(sLessons),
      },
    };
  }, [lessons]);

  const mailSubject = encodeURIComponent("Aanmelding Naailes WILLA");
  const mailBody = encodeURIComponent(
    "Hallo Willeke,\n\nIk meld mij graag aan voor de naailes!\n\nVoorkeur groep:\n[ ] Dinsdagavond (19:30 - 21:30 uur)\n[ ] Zaterdagochtend (10:00 - 12:00 uur)\n\nNaam:\nTelefoonnummer:\nErvaring (beginner / enige ervaring / gevorderd):\nEventuele vragen of opmerkingen:\n\nMet vriendelijke groet,"
  );
  const mailHref = `mailto:Willekevdvw@gmail.com?subject=${mailSubject}&body=${mailBody}`;

  const whatsappMessage = encodeURIComponent(
    "Hallo Willeke, ik wil mij graag aanmelden voor de naailes bij WILLA!"
  );
  const whatsappHref = `https://wa.me/31625393938?text=${whatsappMessage}`;

  return (
    <section id="naailes" className="py-20 bg-card relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-poppins text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Nieuw in het atelier</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Naailes bij WILLA
          </h2>
          <p className="font-poppins text-xl text-muted-foreground max-w-2xl mx-auto">
            Leer naaien op je eigen tempo in een inspirerend en warm atelier in Niekerk.
          </p>
        </div>

        {/* Highlights */}
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4 mb-16">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-background p-4 rounded-xl border-2 border-accent/40 shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span className="font-poppins text-foreground text-sm md:text-base">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Schedule Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Dinsdagavond */}
          <div className="bg-background rounded-2xl shadow-xl overflow-hidden border-4 border-accent flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
            {/* Card Header */}
            <div className="p-8 border-b border-border bg-card/50">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-poppins uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                  Avondlessen
                </span>
                <span className="text-xs font-poppins text-muted-foreground font-medium">
                  {tuesdayGroup.lessons.length} lessen ingepland
                </span>
              </div>
              <h3 className="font-playfair text-3xl font-bold text-foreground mb-2">
                Dinsdagavond
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/20 text-foreground font-poppins text-sm font-semibold mb-3 border border-accent/40">
                <Clock className="w-4 h-4 text-primary" />
                <span>19:30 – 21:30 uur</span>
              </div>
              <p className="font-poppins text-muted-foreground text-sm">
                Ideaal om de week creatief te onderbreken na werk of studie.
              </p>
            </div>

            {/* Dates List */}
            <div className="p-8 space-y-6 flex-grow">
              {tuesdayGroup.months.length === 0 ? (
                <p className="font-poppins text-sm text-muted-foreground italic text-center py-6">
                  Momenteel geen dinsdagavonden ingepland. Neem contact op voor mogelijkheden!
                </p>
              ) : (
                tuesdayGroup.months.map((monthBlock, mIdx) => (
                  <div key={mIdx}>
                    <div className="flex items-center gap-2 mb-3 pb-1 border-b border-border/60">
                      <Calendar className="w-4 h-4 text-primary" />
                      <h4 className="font-playfair font-semibold text-lg text-foreground">
                        {monthBlock.monthName}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {monthBlock.dates.map((d, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-card border border-border/80 text-foreground font-poppins text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                            <span className="font-medium truncate">{d.dateStr}</span>
                          </div>
                          {d.isCustomTime && (
                            <span className="text-[11px] text-muted-foreground flex-shrink-0">
                              {d.timeStr}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Card Footer info */}
            <div className="px-8 py-4 bg-muted/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-poppins">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" /> 19:30 – 21:30 uur
              </span>
              <span>Locatie: Bloemersmastraat 20</span>
            </div>
          </div>

          {/* Card 2: Zaterdagochtend */}
          <div className="bg-background rounded-2xl shadow-xl overflow-hidden border-4 border-accent flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
            {/* Card Header */}
            <div className="p-8 border-b border-border bg-card/50">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-poppins uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                  Ochtendlessen
                </span>
                <span className="text-xs font-poppins text-muted-foreground font-medium">
                  {saturdayGroup.lessons.length} lessen ingepland
                </span>
              </div>
              <h3 className="font-playfair text-3xl font-bold text-foreground mb-2">
                Zaterdagochtend
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/20 text-foreground font-poppins text-sm font-semibold mb-3 border border-accent/40">
                <Clock className="w-4 h-4 text-primary" />
                <span>10:00 – 12:00 uur</span>
              </div>
              <p className="font-poppins text-muted-foreground text-sm">
                Begin je weekend ontspannen en creatief met een kopje thee of koffie.
              </p>
            </div>

            {/* Dates List */}
            <div className="p-8 space-y-6 flex-grow">
              {saturdayGroup.months.length === 0 ? (
                <p className="font-poppins text-sm text-muted-foreground italic text-center py-6">
                  Momenteel geen zaterdagochtenden ingepland. Neem contact op voor mogelijkheden!
                </p>
              ) : (
                saturdayGroup.months.map((monthBlock, mIdx) => (
                  <div key={mIdx}>
                    <div className="flex items-center gap-2 mb-3 pb-1 border-b border-border/60">
                      <Calendar className="w-4 h-4 text-primary" />
                      <h4 className="font-playfair font-semibold text-lg text-foreground">
                        {monthBlock.monthName}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {monthBlock.dates.map((d, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-card border border-border/80 text-foreground font-poppins text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                            <span className="font-medium truncate">{d.dateStr}</span>
                          </div>
                          {d.isCustomTime && (
                            <span className="text-[11px] text-muted-foreground flex-shrink-0">
                              {d.timeStr}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Card Footer info */}
            <div className="px-8 py-4 bg-muted/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-poppins">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" /> 10:00 – 12:00 uur
              </span>
              <span>Locatie: Bloemersmastraat 20</span>
            </div>
          </div>
        </div>

        {/* Call to Action: Sign Up Box */}
        <div className="max-w-3xl mx-auto bg-background p-8 md:p-10 rounded-2xl shadow-xl border-4 border-accent text-center">
          <h3 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-3">
            Aanmelden voor de naailessen
          </h3>
          <p className="font-poppins text-muted-foreground max-w-xl mx-auto mb-8">
            Wil je graag meedoen of heb je nog een vraag? Je kunt je rechtstreeks opgeven per e-mail of telefonisch. Laat hierbij weten welke groep je voorkeur heeft!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Email CTA */}
            <a
              href={mailHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-poppins font-medium shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5" />
              <span>Opgeven per e-mail</span>
            </a>

            {/* Phone CTA */}
            <a
              href="tel:0625393938"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-card text-foreground border-2 border-border px-6 py-3.5 rounded-full font-poppins font-medium hover:border-primary hover:text-primary transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            >
              <Phone className="w-5 h-5 text-primary" />
              <span>06-25393938</span>
            </a>

            {/* WhatsApp CTA */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-card text-foreground border-2 border-border px-6 py-3.5 rounded-full font-poppins font-medium hover:border-primary hover:text-primary transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>
          </div>

          <p className="font-poppins text-xs text-muted-foreground mt-6 italic">
            Adres atelier: Bloemersmastraat 20, Niekerk • Vragen staat altijd vrij!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Naailes;
