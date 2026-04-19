import { useAuth0 } from "@auth0/auth0-react";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ 
      logoutParams: { returnTo: window.location.origin } 
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="group flex items-center gap-2 px-5 py-2.5 rounded-xl
                 text-sm font-semibold text-slate-400 
                 bg-slate-900/50 border border-slate-800
                 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400
                 transition-all duration-300 active:scale-95"
    >
      <LogOut 
        size={16} 
        className="group-hover:-translate-x-1 transition-transform duration-300" 
      />
      <span>Sign Out</span>
    </button>
  );
};

export default LogoutButton;