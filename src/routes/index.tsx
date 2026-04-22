import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import OrderForm from "@/components/OrderForm";
import Payment from "@/components/Payment";
import Contact from "@/components/Contact";
import About from "@/components/About";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <OrderForm />
      <Payment />
      <Contact />
      <About />
      <footer className="container py-8 mt-12 border-t border-border/50 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Nexora Digital. Crafted with precision.
      </footer>
    </main>
  );
}
