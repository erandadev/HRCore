import { Link } from "react-router-dom";

// Helper Components
const SidebarItem = ({ icon, label, redirectTo }) => (
  <Link
    to={redirectTo}
    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition text-left bg-blue-600 text-white`}
  >
    {icon} <span>{label}</span>
  </Link>
);

export default SidebarItem;
