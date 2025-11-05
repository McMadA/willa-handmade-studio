const pricingItems = [
  { service: "Kleding inkorten", price: "V.A. €10,00" },
  { service: "Kleine reparatie", price: "V.A. €5,00" },
  { service: "Grote reparatie", price: "V.A. €10,00" },
  { service: "Kleding innemen", price: "V.A. €10,00" },
  { service: "Rits vervangen", price: "V.A. €15,00" },
  { service: "Knopen vervangen, per knoop", price: "V.A. €1,00" },
  { service: "Gaatje maken (riem, tas, etc)", price: "V.A. €1,00" },
  { service: "Patroon op maat", price: "V.A. €50,00" },
  { service: "Kleding op maat", price: "V.A. €50,00" },
  { service: "Luxe kleding", price: "V.A. €20,00" },
  { service: "Overige reparatie (zitzak, tassen, kussens, etc.)", price: "V.A. €10,00" },
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
          <div className="bg-background rounded-2xl shadow-xl overflow-hidden border-4 border-accent">
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
              Exclusief arbeidskosten
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
