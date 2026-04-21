import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Mail, ShoppingBag, ShieldAlert, FileText, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type ContactMsg = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type OrderRow = {
  id: string;
  name: string;
  email: string;
  service: string | null;
  budget: string | null;
  details: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"messages" | "orders" | "invoice">("messages");
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth", replace: true });
    });

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/auth", replace: true });
        return;
      }

      const ALLOWED_ADMIN_EMAILS = [
        "digitalnexora11@gmail.com",
        "ankitsaha755@gmail.com",
        "jiyamallick889@gmail.com",
      ];
      const userEmail = session.user.email?.toLowerCase() ?? "";
      if (!ALLOWED_ADMIN_EMAILS.includes(userEmail)) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleRow) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);

      const [{ data: msgs }, { data: ords }] = await Promise.all([
        supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("order_submissions")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);
      setMessages((msgs as ContactMsg[]) ?? []);
      setOrders((ords as OrderRow[]) ?? []);
      setLoading(false);
    })();

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center glass rounded-3xl p-10">
          <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">No admin access</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your account is signed in but does not have the admin role. Ask the site owner to grant you access.
          </p>
          <button onClick={signOut} className="btn-hero">Sign out</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 bg-background">
      <div className="container max-w-6xl">
        <header className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <Link to="/" className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
              ← Back to site
            </Link>
            <h1 className="font-display text-3xl md:text-5xl font-bold mt-3">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
          </div>
          <button onClick={signOut} className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-muted/50 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </header>

        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setTab("messages")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              tab === "messages" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass hover:bg-muted/50"
            }`}
          >
            <Mail className="w-4 h-4" /> Messages ({messages.length})
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              tab === "orders" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass hover:bg-muted/50"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setTab("invoice")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              tab === "invoice" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass hover:bg-muted/50"
            }`}
          >
            <FileText className="w-4 h-4" /> Invoice Generator
          </button>
        </div>

        {tab === "messages" && (
          <div className="space-y-4">
            {messages.length === 0 && (
              <p className="text-muted-foreground text-center py-12">No contact messages yet.</p>
            )}
            {messages.map((m) => (
              <div key={m.id} className="glass rounded-2xl p-6">
                <div className="flex justify-between items-start mb-3 gap-4 flex-wrap">
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">{m.email}</a>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <p className="text-foreground/90 whitespace-pre-wrap">{m.message}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "invoice" && (
          <div className="space-y-4">
            <div className="glass rounded-2xl overflow-hidden border border-border">
              <iframe
                src="/invoice-template.html"
                title="Nexora Invoice Generator"
                className="w-full bg-background"
                style={{ height: "calc(100vh - 280px)", minHeight: "700px", border: "0" }}
              />
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 && (
              <p className="text-muted-foreground text-center py-12">No orders yet.</p>
            )}
            {orders.map((o) => (
              <div key={o.id} className="glass rounded-2xl p-6">
                <div className="flex justify-between items-start mb-3 gap-4 flex-wrap">
                  <div>
                    <div className="font-semibold">{o.name}</div>
                    <a href={`mailto:${o.email}`} className="text-sm text-primary hover:underline">{o.email}</a>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString()}
                  </div>
                </div>
                {o.service && (
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">Services: </span>
                    <span className="font-medium">{o.service}</span>
                  </div>
                )}
                {o.budget && (
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">Budget: </span>
                    <span className="font-medium">{o.budget}</span>
                  </div>
                )}
                {o.details && (
                  <p className="text-foreground/90 whitespace-pre-wrap mt-3">{o.details}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
