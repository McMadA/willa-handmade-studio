import heroImage from "@/assets/hero-workspace.jpg";

const Hero = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
          Willa Handmade Design
        </h1>
        <p className="font-poppins text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Geef jouw kleding een tweede leven met ambachtelijke zorg en creativiteit
        </p>
        <a 
          href="#contact" 
          className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-poppins font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 animate-fade-in shadow-lg"
          style={{ animationDelay: '0.4s' }}
        >
          Neem contact op
        </a>
      </div>
    </section>
  );
};

export default Hero;
