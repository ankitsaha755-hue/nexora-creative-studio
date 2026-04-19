import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import OrderForm from "@/components/OrderForm";
import Payment from "@/components/Payment";
import Contact from "@/components/Contact";

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
    </main>
  );
}
