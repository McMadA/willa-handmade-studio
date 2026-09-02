import { Facebook, Mail, MessageCircle, Instagram, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Neem contact op
          </h2>
          <p className="font-poppins text-xl text-muted-foreground max-w-2xl mx-auto">
            Vragen of een project in gedachten? Ik help je graag verder!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          <a
            href="https://www.facebook.com/willahandmadedesign/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-4 border-accent group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Facebook className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-playfair text-2xl font-semibold text-foreground mb-3">
              Facebook
            </h3>
            <p className="font-poppins text-muted-foreground">
              Volg mijn werk en stuur een berichtje
            </p>
          </a>

          <a
            href="mailto:Willekevdvw@gmail.com"
            className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-4 border-accent group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-playfair text-2xl font-semibold text-foreground mb-3">
              E-mail
            </h3>
            <p className="font-poppins text-muted-foreground">
              Willekevdvw@gmail.com
            </p>
          </a>

          <a
            href="https://wa.me/31625393938"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-4 border-accent group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-playfair text-2xl font-semibold text-foreground mb-3">
              WhatsApp
            </h3>
            <p className="font-poppins text-muted-foreground">
              Direct contact via WhatsApp
            </p>
          </a>

          <a
            href="https://www.instagram.com/willa_by.willeke"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-4 border-accent group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Instagram className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-playfair text-2xl font-semibold text-foreground mb-3">
              Instagram
            </h3>
            <p className="font-poppins text-muted-foreground">
              Volg mijn creaties op Instagram
            </p>
          </a>

          <div className="bg-card p-8 rounded-2xl shadow-lg border-4 border-accent">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-playfair text-2xl font-semibold text-foreground mb-3">
              Adres
            </h3>
            <p className="font-poppins text-muted-foreground">
              Bloemersmastraat 20, Niekerk
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
