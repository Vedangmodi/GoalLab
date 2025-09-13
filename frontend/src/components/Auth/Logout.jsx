import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear auth context / redux state / localStorage
    localStorage.removeItem("authToken");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
    >
      <LogOut className="w-4 h-4" /> Logout
    </button>
  );
}
