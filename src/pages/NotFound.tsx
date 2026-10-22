import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="text-center max-w-md p-8 bg-card rounded-2xl shadow-xl border border-accent/40">
        <h1 className="mb-3 font-playfair text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-3 font-playfair text-2xl font-semibold">Oeps! Pagina niet gevonden</h2>
        <p className="mb-6 font-poppins text-muted-foreground text-sm">
          De pagina die je zoekt bestaat niet (meer) of is verplaatst. Keer gerust terug naar het atelier.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-poppins text-sm font-medium hover:opacity-90 transition-all shadow-md"
        >
          Terug naar Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
