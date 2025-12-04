import willekePortrait from "@/assets/willeke-portrait.jpg";
import willaCollage from "@/assets/willa-collage.png";

const About = () => {
  return (
    <>
      {/* Eigenaar Section */}
      <section id="eigenaar" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
                Eigenaar
              </h2>
              <div className="space-y-4 font-poppins text-lg text-muted-foreground leading-relaxed">
                <p>
                  Willeke heeft als 27 jarige haar eigen Atelier aan huis gestart op 11 April '25. Ze heeft een 3jarige opleiding gevolgd op het Alfa College genaamd Fashion Tailor voor heen Modemaat, waar ze zichzelf altijd heeft uitgedaagd. Ontwikkelen van technieken en materiaal keuzes. Altijd al bezig geweest om zoveel mogelijk te hergebruiken wat waarom weggooien als je het nog prima kan gebruiken. Veel kleur en prints zijn van de handtekening van Willeke zelf.
                </p>
                <p>
                  De liefde voor stof en mode heeft ze al vanaf kinds af aan. Als kleine meid tussen de Barbies altijd aan het spellen met lapjes stof om de poppen zo leuk mogelijk aan te kleden. Eind klas 1 stopte dat (2013) in 2020 rond covid kwam de passie van kleding en vooral het maken achter de naaimachine weer tot leven en toen is Willeke aan de opleiding gestart. Voor de duurzaamheid en kleding een langere duur te geven spreekt Willeke erg aan maar ook unieke kleding stukken maken voor klanten spreekt haar erg aan. Willeke hoopt dit heel lang met veel liefde en dankbaarheid te doen.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-accent">
                <img 
                  src={willekePortrait} 
                  alt="Willeke - Eigenaar van WILLA" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/30 rounded-2xl border-2 border-accent -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* WILLA Section */}
      <section id="willa" className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
                  WILLA
                </h2>
                <div className="space-y-4 font-poppins text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Willa is een naaiatelier waar je voor al je textiel wensen of reparaties Langs kunt komen. Ze doet het alleen dus houd rekening met een aantal weken maak tijd.
                  </p>
                  <p>
                    De naam WILLA leid zich af van (Will) eke en de A staat voor atelier waar je Willeke vindt die druk met jou opdracht bezig is. WILLA staat voor duurzaamheid en bewustwording voor je kleding. Want waarom nieuw kopen als het ook gemaakt kan worden of er juist iets heel nieuws van maken. Daarvoor ben je bij WILLa op het juiste adres. Elke vraag mag gesteld worden en samen met Willeke kom je tot een goede oplossing.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src={willaCollage} 
                  alt="WILLA atelier collage" 
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
