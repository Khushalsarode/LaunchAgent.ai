import { useAuth0 } from "@auth0/auth0-react";
import { LogIn } from "lucide-react"; // Optional: Adding an icon for better UX

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button 
      onClick={() => loginWithRedirect()} 
      className="group relative flex items-center justify-center gap-2 px-8 py-3 
                 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm 
                 rounded-xl transition-all duration-300 shadow-lg 
                 shadow-indigo-500/25 active:scale-95 overflow-hidden"
    >
      {/* Interactive Shine Effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      
      <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform" />
      <span>Get Started</span>
    </button>
  );
};

export default LoginButton;