import { FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import QuickAction from "./QuickAction";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <main className="flex-1 p-8 overflow-y-auto" style={{ marginTop: "25px" }}>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back,{" "}
            <span style={{ textTransform: "capitalize" }}>{user.username}</span>
          </h2>
          <p className="text-gray-500">Hi! How are you?</p>
        </div>
      </header>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/payslip">
              <QuickAction
                title="Generate Payslips"
                description="Generate your monthly payslip here"
                icon={FileText}
              />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
