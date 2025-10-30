import detailImage from "@/assets/detail-embroidery.jpg";

const About = () => {
  return (
    <section id="over" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Over Willa Handmade Design
            </h2>
            <div className="space-y-4 font-poppins text-lg text-muted-foreground leading-relaxed">
              <p>
                Welkom bij Willa Handmade Design! Mijn naam is Willa en ik ben gepassioneerd door het creëren en herstellen van kleding met liefde voor het ambacht.
              </p>
              <p>
                Ik geloof in de kracht van duurzaamheid en het geven van een tweede leven aan je favoriete kledingstukken. Of het nu gaat om een simpele reparatie, het customizen van een oud kledingstuk of het toevoegen van unieke details – elk stuk krijgt mijn volledige aandacht.
              </p>
              <p>
                Met oog voor detail en een creatieve aanpak zorg ik ervoor dat jouw kleding niet alleen gerepareerd wordt, maar ook een persoonlijk statement wordt. Samen maken we van oud nieuw!
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={detailImage} 
                alt="Handgemaakte borduurdetails" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/20 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
