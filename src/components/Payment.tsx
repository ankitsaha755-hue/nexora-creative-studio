import { CreditCard, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const pay = (provider: "Razorpay" | "PayPal") => {
    toast.success(`${provider} checkout initiated`, {
      description: "This is a demo. Real payment processing can be wired up later.",
    });
  };

  return (
    <section id="payment" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-60" />

      <div className="container max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Secure Checkout</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
            Pay <span className="text-gradient">Your Way</span>
          </h2>
          <p className="text-muted-foreground text-lg">Two trusted payment gateways. End-to-end encrypted.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="group glass rounded-3xl p-8 hover-lift relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl font-display font-black tracking-tight">Razorpay</div>
                <div className="px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-primary">
                  India
                </div>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Pay via UPI, Cards, NetBanking, or Wallets — preferred for Indian customers.
              </p>
              <button onClick={() => pay("Razorpay")} className="btn-hero w-full">
                <CreditCard className="w-5 h-5" /> Pay with Razorpay
              </button>
            </div>
          </div>

          <div className="group glass rounded-3xl p-8 hover-lift relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400/30 to-blue-600/30 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl font-display font-black tracking-tight">
                  Pay<span className="text-gradient">Pal</span>
                </div>
                <div className="px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-primary">
                  Global
                </div>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Trusted worldwide — pay securely with your PayPal balance, card, or bank.
              </p>
              <button onClick={() => pay("PayPal")} className="btn-hero w-full">
                <CreditCard className="w-5 h-5" /> Pay with PayPal
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, t: "256-bit SSL", d: "Bank-grade encryption on every transaction." },
            { icon: Zap, t: "Instant Confirmation", d: "Get your receipt the moment you pay." },
            { icon: CreditCard, t: "Multiple Methods", d: "Cards, UPI, wallets, bank transfers." },
          ].map((f) => (
            <div key={f.t} className="glass rounded-2xl p-6 text-center hover-lift">
              <f.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold mb-1">{f.t}</h4>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Payment;
