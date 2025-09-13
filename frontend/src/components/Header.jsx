
import { NavLink } from "react-router-dom";
import {
  Target,
  User,
  LayoutDashboard,
  PlusCircle,
  LogIn,
  UserPlus,
  Menu,
  X,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 text-white font-bold text-xl"
        >
          <Target className="w-7 h-7" />
          GoalLab
        </NavLink>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex gap-6 text-white font-medium">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => 
              `flex items-center gap-1 transition ${isActive ? 'text-yellow-200' : 'text-white hover:text-yellow-200'}`
            }
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink
            to="/goals/create"
            className={({ isActive }) => 
              `flex items-center gap-1 transition ${isActive ? 'text-yellow-200' : 'text-white hover:text-yellow-200'}`
            }
          >
            <PlusCircle className="w-5 h-5" /> Create Goal
          </NavLink>
          <NavLink
            to="/tutor"
            className={({ isActive }) => 
              `flex items-center gap-1 transition ${isActive ? 'text-yellow-200' : 'text-white hover:text-yellow-200'}`
            }
          >
            <User className="w-5 h-5" /> AI Tutor
          </NavLink>
          <NavLink
            to="/checkin"
            className={({ isActive }) => 
              `flex items-center gap-1 transition ${isActive ? 'text-yellow-200' : 'text-white hover:text-yellow-200'}`
            }
          >
            <CheckCircle className="w-5 h-5" /> Check-in
          </NavLink>
        </nav>

        {/* User Menu - Desktop */}
        <div
          className="relative hidden md:block"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition">
            <User className="w-6 h-6 text-indigo-600" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    onClick={() => setOpen(false)}
                  >
                    <User className="w-4 h-4" /> Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    onClick={() => setOpen(false)}
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    onClick={() => setOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" /> Register
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-indigo-600 shadow-lg py-4 px-6">
            <nav className="flex flex-col gap-4">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => 
                  `flex items-center gap-2 transition ${isActive ? 'text-yellow-200' : 'text-white hover:text-yellow-200'}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </NavLink>
              <NavLink
                to="/goals/create"
                className={({ isActive }) => 
                  `flex items-center gap-2 transition ${isActive ? 'text-yellow-200' : 'text-white hover:text-yellow-200'}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle className="w-5 h-5" /> Create Goal
              </NavLink>
              <NavLink
                to="/tutor"
                className={({ isActive }) => 
                  `flex items-center gap-2 transition ${isActive ? 'text-yellow-200' : 'text-white hover:text-yellow-200'}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" /> AI Tutor
              </NavLink>
              <NavLink
                to="/checkin"
                className={({ isActive }) => 
                  `flex items-center gap-2 transition ${isActive ? 'text-yellow-200' : 'text-white hover:text-yellow-200'}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <CheckCircle className="w-5 h-5" /> Check-in
              </NavLink>
              
              {user ? (
                <>
                  <div className="border-t border-indigo-400 pt-4 mt-2">
                    <p className="text-sm text-white font-medium">{user.name}</p>
                    <p className="text-xs text-indigo-100">{user.email}</p>
                  </div>
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 text-white hover:text-yellow-200 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" /> Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white hover:text-yellow-200 transition text-left"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="flex items-center gap-2 text-white hover:text-yellow-200 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" /> Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="flex items-center gap-2 text-white hover:text-yellow-200 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" /> Register
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}