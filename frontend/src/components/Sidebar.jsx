import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LayoutDashboard, Calendar, MapPin, Users, UserCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = {
        STUDENT: [
            { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20}/> },
            { name: 'Exam Seating', path: '/student/seating', icon: <MapPin size={20}/> },
            { name: 'Faculty Status', path: '/student/faculty', icon: <Users size={20}/> },
            { name: 'Profile', path: '/student/profile', icon: <UserCircle size={20}/> },
        ],
        FACULTY: [
            { name: 'Dashboard', path: '/faculty', icon: <LayoutDashboard size={20}/> },
            { name: 'Weekly Schedule', path: '/faculty/schedule', icon: <Calendar size={20}/> },
            { name: 'Profile', path: '/faculty/profile', icon: <UserCircle size={20}/> },
        ],
        ADMIN: [
            { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20}/> },
            { name: 'Students', path: '/admin/students', icon: <Users size={20}/> },
            { name: 'Timetable', path: '/admin/timetable', icon: <Calendar size={20}/> },
            { name: 'Exam Seating', path: '/admin/seating', icon: <MapPin size={20}/> },
        ]
    };

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 text-2xl font-bold border-b border-slate-700 text-blue-400">
                College CMS
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {menuItems[user?.role]?.map((item) => (
                    <Link key={item.name} to={item.path}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition">
                        {item.icon}
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>
            <button onClick={() => { logout(); navigate('/login'); }}
                    className="m-4 flex items-center space-x-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition">
                <LogOut size={20}/>
                <span>Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;