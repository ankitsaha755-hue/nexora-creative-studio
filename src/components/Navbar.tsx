import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Lock } from "lucide-react";
import nexoraLogo from "@/assets/nexora-logo.jpeg";

const links = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#order", label: "Order" },
  { href: "#payment", label: "Payment" },
  { href: "#contact", label: "Contact" },
  { href: "#about", label: "About" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-3" : "py-5 bg-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <img
            src={nexoraLogo}
            alt="Nexora Digital logo"
            className="w-10 h-10 rounded-lg object-cover shadow-glow group-hover:scale-110 transition-transform"
          />
          <span className="font-display text-lg font-bold tracking-wider">
            NEXORA<span className="text-gradient"> DIGITAL</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gradient-primary hover:after:w-full after:transition-all after:duration-300"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            Admin
          </Link>
          <a href="#order" className="btn-hero !py-2.5 !px-6 text-sm">
            Get Started
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-foreground"
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass mt-3 mx-4 rounded-2xl p-6 animate-fade-up">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  onClick={() => setOpen(false)}
                  href={l.href}
                  className="block text-foreground/80 hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 text-primary font-semibold"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
