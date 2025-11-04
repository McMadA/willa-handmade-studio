const Footer = () => {
  return (
    <footer className="bg-slate-800 py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="font-poppins text-slate-300 text-sm">
          © {new Date().getFullYear()} WILLA. Alle rechten voorbehouden.
        </p>
        <p className="font-poppins text-slate-300 text-sm mt-1">
          Website geleverd door{" "}
          <a 
            href="https://creationaltfix.nl" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Creation+Alt+Fix
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
