import { useState } from "react";

import { Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import PaySlip from "./components/PaySlip";
import ProtectedRoute from "./utils/ProtectedRoute";
import SidebarItem from "./utils/SideBarItem";

import { useNavigate } from "react-router-dom";
import ForbiddenPage from "./components/ForbiddenPage";

import { Lock, User, InfoIcon, Clock, LogOut, MenuIcon, X } from "lucide-react";

import api from "./utils/api";

const App = () => {
  const navigate = useNavigate();

  let [error, setError] = useState("");

  const user = localStorage.getItem("user");

  let [userInputData, setUserInputData] = useState({
    username: "",
    password: "",
  });

  let [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuButtonClick = () => {
    console.log(isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleChange = (e) => {
    setError("");
    setUserInputData({
      ...userInputData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = async () => {
    const logoutStatus = await api.get("/api/auth/logout");

    if (logoutStatus.data.status === "SUCCESS") {
      localStorage.clear();
      navigate("/");
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    localStorage.clear();
    const username = userInputData.username;
    const password = userInputData.password;

    if (username === "" || password === "") {
      setError("All fields are required");
    }

    try {
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });

      const data = response["data"];

      if (data.status === "SUCCESS") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data.username,
            role: data.role,
          }),
        );

        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      localStorage.clear();
      setError(err.response?.data?.message);
      console.error("Login failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 p-8 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              HRCore
            </h1>
            <p className="text-blue-100 mt-2">Management System Portal</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="username"
                  value={userInputData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  value={userInputData.password}
                  name="password"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </button>

            {error !== "" ? (
              <div
                class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
                role="alert"
              >
                <div class="flex">
                  <div class="py-1" style={{ marginRight: 15 }}>
                    <InfoIcon />
                  </div>
                  <div>
                    <p class="font-bold">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={
          isMenuOpen
            ? "w-64 bg-slate-900 text-white md:flex flex-col"
            : "w-64 bg-slate-900 text-white hidden  md:flex flex-col"
        }
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">
            HRCore
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem
            icon={<Clock size={20} />}
            label="Dashboard"
            redirectTo="/"
          />

          {/* Other nav items... */}
        </nav>
        <div className="p-4 border-t border-slate-800 text-gray-400">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-2 hover:text-white transition w-full"
          >
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <div
        className={
          isMenuOpen ? "md:hidden m-5" : "fixed top-5 left-5 md:hidden"
        }
        onClick={handleMenuButtonClick}
        style={{ cursor: "pointer" }}
      >
        {isMenuOpen ? <X /> : <MenuIcon />}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payslip"
          element={
            <ProtectedRoute>
              <PaySlip />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<ForbiddenPage />} />
      </Routes>
    </div>
  );
};

export default App;
