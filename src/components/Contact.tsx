import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const WA_MESSAGE =
  "Hello Nexora Digital Team! I am interested in gaining a detailed understanding about your services and would appreciate further details.";
const WA_NUMBERS = [
  { label: "+91 93302 52564", number: "919330252564" },
  { label: "+91 96741 26372", number: "919674126372" },
];

const WhatsApp = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.555-5.338 11.89-11.893 11.89a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields.");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      if (error) throw error;
      toast.success("Message sent! We'll reply within 24 hours.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-32">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Get In Touch</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
            Contact <span className="text-gradient">Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: Mail, t: "Email", v: "digitalnexora11@gmail.com" },
              { icon: Phone, t: "Phone", v: ["+91 93302 52564", "+91 96741 26372"] },
              { icon: MapPin, t: "Office", v: "Remote • Worldwide" },
            ].map((c) => (
              <div key={c.t} className="glass rounded-2xl p-6 hover-lift flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
                  <c.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.t}</div>
                  <div className="font-semibold mt-1">
                    {Array.isArray(c.v) ? c.v.map((line) => <div key={line}>{line}</div>) : c.v}
                  </div>
                </div>
              </div>
            ))}

            <div className="glass rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Follow</div>
              <div className="flex gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label="WhatsApp"
                      className="w-11 h-11 rounded-full glass flex items-center justify-center hover:bg-gradient-primary hover:scale-110 transition-all duration-300"
                    >
                      <WhatsApp className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="start">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground px-2 py-1.5">
                      Choose a number
                    </div>
                    {WA_NUMBERS.map((n) => (
                      <a
                        key={n.number}
                        href={`https://wa.me/${n.number}?text=${encodeURIComponent(WA_MESSAGE)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <WhatsApp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{n.label}</span>
                      </a>
                    ))}
                  </PopoverContent>
                </Popover>
                {[
                  { Icon: Facebook, href: "https://www.facebook.com/share/14aphi7LT2j/", label: "Facebook" },
                  { Icon: Instagram, href: "https://www.instagram.com/nexorra.digital/?hl=en", label: "Instagram" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-full glass flex items-center justify-center hover:bg-gradient-primary hover:scale-110 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="lg:col-span-3 glass rounded-3xl p-8 md:p-10 space-y-6 shadow-elegant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold mb-2 block">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button type="submit" disabled={sending} className="btn-hero w-full disabled:opacity-60">
              <Send className="w-4 h-4" /> {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <footer className="container mt-24 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Nexora Digital. Crafted with precision.
      </footer>
    </section>
  );
};

export default Contact;
