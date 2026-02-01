import { FileText, ChevronRight } from "lucide-react";

import { Link } from "react-router-dom";

const QuickAction = ({ title, description, icon: Icon }) => (
  <button className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-blue-50 transition-colors rounded-lg group">
    <div className="flex items-center space-x-4">
      <Icon size={20} className="text-blue-600" />
      <div className="text-left">
        <p className="font-semibold text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <ChevronRight
      size={18}
      className="text-gray-400 group-hover:text-blue-600"
    />
  </button>
);

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
