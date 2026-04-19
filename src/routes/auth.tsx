import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate({ to: "/admin", replace: true });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/admin", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md glass rounded-3xl p-8 md:p-10 shadow-elegant">
        <Link to="/" className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
          ← Back to site
        </Link>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-2">
          Admin <span className="text-gradient">Access</span>
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          {mode === "signin" ? "Sign in to view submissions." : "Create your admin account."}
        </p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
                placeholder="••••••••"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-hero w-full">
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors w-full text-center"
        >
          {mode === "signin"
            ? "Need to create an admin account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
