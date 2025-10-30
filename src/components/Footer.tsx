const Footer = () => {
  return (
    <footer className="bg-foreground/5 py-8 border-t border-border">
      <div className="container mx-auto px-6 text-center">
        <p className="font-poppins text-muted-foreground">
          © {new Date().getFullYear()} Willa Handmade Design - Alle rechten voorbehouden
        </p>
        <p className="font-poppins text-sm text-muted-foreground mt-2">
          Ambachtelijke kledingreparatie met liefde gemaakt
        </p>
      </div>
    </footer>
  );
};

export default Footer;
