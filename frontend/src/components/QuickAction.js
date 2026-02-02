// Reuseable Component for make quick actions on dashboard
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

export default QuickAction;
