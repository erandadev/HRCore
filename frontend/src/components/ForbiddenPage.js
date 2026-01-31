import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <div className="w-full text-center">
        <div className="relative flex justify-center mb-8">
          <div className="bg-red-100 p-6 rounded-full animate-pulse">
            <ShieldAlert size={64} className="text-red-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-md border border-gray-100">
            <Lock size={20} className="text-gray-400" />
          </div>
        </div>

        <h1 className="text-6xl font-black text-slate-900 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Access Forbidden
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Sorry, you don't have permission to access this page. Please contact
          your HR administrator if you believe this is a mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 italic">
            HRCore Security Protocol v1.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
