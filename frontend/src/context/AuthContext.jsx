import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const user = useSelector((state) => state.auth.user);
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
