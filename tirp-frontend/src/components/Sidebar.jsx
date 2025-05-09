import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  UserPlusIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { label: 'Students', path: '/students', icon: UsersIcon },
  { label: 'Add Student', path: '/add-student', icon: UserPlusIcon },
  { label: 'Priorities', path: '/priorities', icon: AdjustmentsHorizontalIcon },
  { label: 'Allocation', path: '/allocation', icon: ChartBarIcon },
  { label: 'Export', path: '/export', icon: ArrowDownTrayIcon },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="text-2xl font-bold text-center py-6 text-blue-600 border-b">ClassForge</div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition hover:bg-blue-50 ${
                isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
