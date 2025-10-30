const pricingItems = [
  { service: "Zoom/naad herstellen", price: "Vanaf €8" },
  { service: "Broek inkorten", price: "Vanaf €12" },
  { service: "Rits vervangen", price: "Vanaf €15" },
  { service: "Gaten herstellen/stoppen", price: "Vanaf €10" },
  { service: "Eenvoudige patches aanbrengen", price: "Vanaf €8" },
  { service: "Borduren (klein motief)", price: "Vanaf €15" },
  { service: "Borduren (groot/complex)", price: "Op aanvraag" },
  { service: "Custom upcycling project", price: "Op aanvraag" },
];

const Pricing = () => {
  return (
    <section id="prijzen" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Prijslijst
          </h2>
          <p className="font-poppins text-xl text-muted-foreground max-w-2xl mx-auto">
            Eerlijke prijzen voor kwaliteitsvol handwerk
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-background rounded-2xl shadow-xl overflow-hidden border border-border">
            <div className="divide-y divide-border">
              {pricingItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-6 hover:bg-muted/50 transition-colors duration-200"
                >
                  <span className="font-poppins text-lg text-foreground font-medium">
                    {item.service}
                  </span>
                  <span className="font-poppins text-lg text-primary font-semibold">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="font-poppins text-muted-foreground italic">
              Prijzen zijn indicatief. Voor complexere werkzaamheden ontvang je een offerte op maat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
