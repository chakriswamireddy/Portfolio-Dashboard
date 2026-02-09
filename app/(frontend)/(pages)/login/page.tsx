"use client";

import { useState } from "react";
import { Input } from "../../components/ui/Input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");

  const [mode, setMode] = useState<"login" | "register">("login");

  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      router.push("/dashboard");

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleTestLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 
    try {
      const res = await fetch(`/api/test-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
      });

      const data = await res.json(); 
      router.push("/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          Trading Dashboard
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          {mode} to manage your portfolio
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div
            className={`  transition-all duration-300 overflow-hidden
              ${
                mode === "register"
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              } `}
          >
            <Input label="Name" onChange={setName} value={name} type="text" />
          </div>

          <Input label="Email" onChange={setEmail} value={email} type="email" />
          <Input
            label="Password"
            onChange={setPassword}
            value={password}
            type="password"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className=" flex-2  mt-2  w-full rounded-lg bg-pink-600 py-2 text-sm font-medium text-black hover:bg-pink-500 transition disabled:opacity-60"
            >
              {mode === "login"
                ? loading
                  ? "Signing in..."
                  : "Sign In"
                : loading
                ? "Registering..."
                : "Register"}
            </button>

            <button
              type="submit"
              disabled={loading}
              onClick={ handleTestLogin }
              className=" flex-1 mt-2 w-full rounded-lg border border-pink-600 py-2 text-sm font-medium text-pink-500 hover:border-pink-400 transition disabled:opacity-60"
            >
              Test User
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="mt-2 cursor-pointer rounded-lg   py-2 text-sm font-medium text-pink-600 hover:underline   transition disabled:opacity-60"
          >
            {mode === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
