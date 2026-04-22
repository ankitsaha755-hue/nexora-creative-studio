import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const serviceOptions = [
  "Website Development",
  "Web Application Development",
  "PowerPoint Presentation",
  "Branding/Lead Generation",
  "Data Management and Analytics",
  "App Development",
  "Logo Generation",
  "Automation",
  "Template Making (With PDF downloader)",
];

const OrderForm = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", budget: "", details: "" });
  const [sending, setSending] = useState(false);

  const toggle = (s: string) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || selected.length === 0) {
      toast.error("Please fill required fields and select at least one service.");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from("order_submissions").insert({
        service: selected.join(", "),
        package: null,
        name: form.name,
        email: form.email,
        budget: form.budget || null,
        details: form.details || null,
      });
      if (error) throw error;
      toast.success("Order received! We'll contact you within 24 hours.");
      setForm({ name: "", email: "", budget: "", details: "" });
      setSelected([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="order" className="relative py-32">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Place Your Order</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
            Let's <span className="text-gradient">Build Together</span>
          </h2>
          <p className="text-muted-foreground text-lg">Tell us what you need — we'll get back fast.</p>
        </div>

        <form onSubmit={submit} className="glass rounded-3xl p-8 md:p-12 shadow-elegant space-y-8">
          <div>
            <label className="text-sm font-semibold mb-4 block text-foreground/90">Choose Services *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceOptions.map((s) => {
                const active = selected.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggle(s)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
                      active
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border bg-muted/30 hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        active ? "bg-gradient-primary" : "border border-border"
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                    <span className="text-sm font-medium">{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">Full Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Budget (USD)</label>
            <input
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
              placeholder="e.g. 2,500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Project Details</label>
            <textarea
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              rows={5}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all resize-none"
              placeholder="Tell us about your goals, timeline, and any specific requirements..."
            />
          </div>

          <button type="submit" disabled={sending} className="btn-hero w-full group disabled:opacity-60">
            <ShoppingBag className="w-5 h-5" />
            {sending ? "Submitting..." : "Submit Order Request"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default OrderForm;
