import { Facebook, Mail, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Neem contact op
          </h2>
          <p className="font-poppins text-xl text-muted-foreground max-w-2xl mx-auto">
            Vragen of een project in gedachten? Ik help je graag verder!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <a
            href="https://www.facebook.com/willahandmadedesign/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border group"
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
            href="mailto:info@willahandmadedesign.nl"
            className="bg-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-playfair text-2xl font-semibold text-foreground mb-3">
              E-mail
            </h3>
            <p className="font-poppins text-muted-foreground">
              info@willahandmadedesign.nl
            </p>
          </a>

          <a
            href="https://wa.me/31625393938"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-background p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border group"
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
        </div>
      </div>
    </section>
  );
};

export default Contact;
