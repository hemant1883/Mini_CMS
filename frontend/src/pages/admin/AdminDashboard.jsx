import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, GraduationCap, Calendar, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalStudents: 0, totalFaculty: 0, totalClasses: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) { console.error(err); }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <div className={`p-6 bg-white rounded-xl shadow-md border-b-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">{title}</p>
                    <h3 className="text-3xl font-black mt-1 text-gray-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('border', 'text')}`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Admin Control Center</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Total Students" value={stats.totalStudents} icon={<GraduationCap size={28}/>} color="border-blue-500" />
                <StatCard title="Faculty Members" value={stats.totalFaculty} icon={<Users size={28}/>} color="border-purple-500" />
                <StatCard title="Active Classes" value={stats.totalClasses} icon={<Calendar size={28}/>} color="border-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100">Add New Student</button>
                        <button className="p-4 bg-purple-50 text-purple-700 rounded-lg font-semibold hover:bg-purple-100">Assign Faculty</button>
                        <button className="p-4 bg-orange-50 text-orange-700 rounded-lg font-semibold hover:bg-orange-100">Create Timetable</button>
                        <button className="p-4 bg-gray-50 text-gray-700 rounded-lg font-semibold hover:bg-gray-100">System Logs</button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Settings size={20}/> System Health
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span>Database Connection</span>
                            <span className="text-green-600 font-bold">Online</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>JWT Authentication</span>
                            <span className="text-green-600 font-bold">Secure</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full w-[95%]"></div>
                        </div>
                        <p className="text-xs text-gray-400 italic">Server running on Java 21 - Spring Boot 3.2</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;