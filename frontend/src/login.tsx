import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "./services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autocerrar tooltip después de unos segundos
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await loginApi({ email, password });
      // Guarda token/usuario según tu backend
      if (res?.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
      }
      navigate("/");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not log in. Please check your credentials.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-[#C6FECE]">
      <section className="flex flex-row justify-center items-center h-[520px] absolute">
        {/* Circulitos decorativos */}
        <div className="rounded-full size-16 bg-white absolute -bottom-8 -right-8" />
        <div className="rounded-full size-16 bg-linear-to-b from-[#6EFA5B] to-[#0C5719] absolute -top-8 -left-8" />

        {/* Back to home */}
        <Link to="/" className="flex items-center gap-2 absolute top-4 left-4 text-black opacity-80 text-3xl z-10">
          <i className="ti ti-chevron-left" />
          <span className="text-sm">Back to home</span>
        </Link>

        {/* Login form */}
        <section className="flex flex-col justify-between items-center text-center h-full gap-4 bg-white text-black p-16 py-24 rounded-l-3xl relative">
          <div>
            <h2 className="text-xl font-bold text-center uppercase opacity-70">Login</h2>
            <p className="opacity-70">Welcome back! Please log in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <label className="flex items-center bg-[#D6FFDE] p-2 py-3 pl-3 rounded-2xl cursor-text">
              <i className="ti ti-at text-2xl" />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ml-2 bg-transparent outline-none w-full text-sm placeholder:text-[#6A7B6F]"
              />
            </label>

            <label className="flex items-center bg-[#D6FFDE] p-2 py-3 pl-3 rounded-2xl cursor-text">
              <i className="ti ti-lock text-2xl" />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ml-2 bg-transparent outline-none w-full text-sm placeholder:text-[#6A7B6F]"
              />
            </label>

            <div className="flex flex-col gap-4 w-full mt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center bg-[#028414CF] opacity-80 p-2 py-3 pl-3 rounded-2xl justify-center text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
              <p className="text-sm">
                You don't have an account?{" "}
                <Link to="/signup" className="font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </section>

        {/* Imagen lateral */}
        <section className="rounded-r-3xl h-full relative">
          <div className="flex justify-center items-center rounded-r-3xl bg-[#028414] shadow-lg w-[425px] h-full relative overflow-hidden">
            <img src="/weird-pattern.jpg" alt="Pattern" className="h-full opacity-35 rounded-r-3xl absolute top-0" />
            <div className="bg-white opacity-55 w-64 h-80 rounded-3xl" />
            <img src="/login-img.png" alt="Plant" className="absolute size-80 object-contain" />
          </div>
        </section>
      </section>

      {/* Tooltip / toast de error */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs bg-red-500 text-white text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <i className="ti ti-alert-circle text-lg" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-2 text-xs opacity-80 hover:opacity-100 underline">
            Close
          </button>
        </div>
      )}
    </main>
  );
}
