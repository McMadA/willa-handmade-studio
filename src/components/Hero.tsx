import heroImage from "@/assets/hero-workspace.jpg";
import willaLogo from "@/assets/willa-logo.jpg";

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
        <img 
          src={willaLogo} 
          alt="Willa Handmade Design Logo" 
          className="w-48 md:w-64 mx-auto mb-6 animate-fade-in"
        />
        <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Willa Handmade Design
        </h1>
        <p className="font-poppins text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in italic" style={{ animationDelay: '0.15s' }}>
          Willa kunt u vinden in Niekerk, Groningen.<br />
          Hier komen al jou textiel wensen uit!<br />
          <br />
          tot snel bij Willa..!!
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
