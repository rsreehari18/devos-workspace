import React, { useState } from "react";
import { User } from "../types";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import { Shield, Loader2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface AuthInterfaceProps {
  onAuthSuccess: (user: User, token: string) => void;
  initialEmail?: string;
  initialMode?: "login" | "register" | "otp";
}

export default function AuthInterface({ onAuthSuccess }: AuthInterfaceProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleGoogleOAuth = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // 1. Trigger the Firebase OAuth Popup directly
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      if (!firebaseUser.email) {
        throw new Error("OAuth failed: No email associated with this Google account.");
      }

      const email = firebaseUser.email;
      const username = firebaseUser.displayName || email.split("@")[0];
      const idToken = await firebaseUser.getIdToken();

      // 2. Exchange credentials with the backend server
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to establish verified session with backend.");
      }

      setSuccessMsg(`Session established! Welcome back, ${data.user.username}`);

      // 3. Keep local storage in sync
      localStorage.setItem("devos_token", data.token);
      localStorage.setItem("devos_user_raw", JSON.stringify(data.user));

      // 4. Trigger state update inside the React app
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 700);
    } catch (err: any) {
      console.error("OAuth Routine Exception:", err);
      // Handle the user cancelling the popup window gracefully
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Authentication aborted: Secure popup was closed. Please try again.");
      } else {
        setErrorMsg(err.message || "An unexpected error occurred during Google OAuth.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="authentication-suite" className="max-w-md w-full mx-auto space-y-6 text-left p-2">
      {/* DevOS Platform Frame Heading */}
      <div className="text-center space-y-2">
        <div className="flex justify-center items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold select-none text-sm font-mono tracking-tighter shadow-indigo-650/45 shadow-lg">
            D
          </div>
          <span className="text-xl font-black text-white tracking-tight font-mono">DEVOS WORKSTATION</span>
        </div>
        <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
          SECURED BY OAUTH IDENTITIES
        </p>
      </div>

      <div className="rounded-xl overflow-hidden bg-[#090a10]/95 border border-zinc-850 p-6 md:p-8 space-y-5 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse"></div>

        {/* Status Alerts banner */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 text-xs rounded flex items-center gap-2 font-mono"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs rounded flex items-center gap-2 font-mono"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Central visual branding */}
        <div className="space-y-4 py-2 text-center md:text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-900/30 flex items-center justify-center text-blue-400 flex-shrink-0 hidden md:flex">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold font-mono text-zinc-200 uppercase tracking-wide">
                Unified Authentication Gateway
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Legacy password databases and verification PIN systems have been decommissioned. Secure instantly with your official Google credentials to authorize your workstation shell access.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Google OAuth Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGoogleOAuth}
            disabled={loading}
            className="w-full relative group py-3 px-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 font-mono font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-950/20 overflow-hidden"
          >
            {/* Soft inner glow hover */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            ) : (
              // Precision custom vector styled Google "G" representation
              <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center relative">
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.65-.63-1.04-1.37-1.19-2.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
            )}

            <span className="relative z-10 tracking-wide uppercase text-zinc-100 font-extrabold flex items-center gap-1.5">
              {loading ? "Authenticating session..." : "Continue with Google"}
              {!loading && <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors group-hover:translate-x-0.5" />}
            </span>
          </button>
        </div>

        {/* Security details checklist */}
        <div className="pt-2 border-t border-zinc-900">
          <div className="p-3.5 rounded-lg bg-[#040508]/60 border border-zinc-900 text-[10px] font-mono leading-relaxed text-zinc-400 space-y-2">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase tracking-wider text-[9.5px]">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>OAUTH FLOW SPECIFICATIONS</span>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-zinc-500">
              <div>PROVIDER:</div>
              <div className="text-zinc-300 font-semibold">Firebase Google Auth</div>
              <div>ENCRYPTION:</div>
              <div className="text-zinc-300 font-semibold">AES-256 JSON-Web-Token</div>
              <div>VERIFICATION:</div>
              <div className="text-zinc-300 font-semibold">Instant on Handshake</div>
              <div>BYPASS STATUS:</div>
              <div className="text-emerald-400 font-bold">MUTED / REDUNDANT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
