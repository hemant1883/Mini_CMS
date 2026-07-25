import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { Power, BookOpen, Clock, Users, ShieldCheck } from 'lucide-react';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState([]);
    const [status, setStatus] = useState(user.status || 'FREE');

    useEffect(() => {
        const fetchSchedule = async () => {
            const res = await api.get(`/timetable/faculty/today/${user.id}`);
            setSchedule(res.data);
        };
        fetchSchedule();
    }, [user.id]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            // This updates the 'status' column in the database
            await api.put(`/faculty/status/${user.id}/${newStatus}`);
            setStatus(newStatus);

            // Instant feedback
            alert(`You are now marked as ${newStatus}`);
        } catch (err) {
            alert("Failed to update status manually.");
        }
    };

    return (
        <div className="p-8 ml-64 bg-slate-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800">Faculty Command Center</h1>
                <p className="text-slate-500">Welcome back, Prof. {user.name}.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* 1. Status Toggle (Large Sidebar Style) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Power size={14}/> Current Status
                    </h2>
                    <div className="space-y-3">
                        {['FREE', 'BUSY', 'IN_CLASS', 'ON_LEAVE'].map(s => (
                            <button
                                key={s}
                                onClick={() => handleStatusUpdate(s)}
                                className={`w-full p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${
                                    status === s ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                }`}
                            >
                                {s.replace('_', ' ')}
                                {status === s && <ShieldCheck size={16}/>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Main Schedule and Stats */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl">
                            <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider">Upcoming Lecture</p>
                            <h2 className="text-2xl font-black mt-2">{schedule[0]?.subject || "No more classes"}</h2>
                            <div className="flex items-center gap-4 mt-4 text-indigo-100">
                                <span className="flex items-center gap-1 text-sm font-bold"><Clock size={16}/> {schedule[0]?.timeSlot || "--"}</span>
                                <span className="flex items-center gap-1 text-sm font-bold"><MapPin size={16}/> Room {schedule[0]?.roomNumber || "--"}</span>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Lectures Today</p>
                            <h2 className="text-4xl font-black mt-2 text-slate-800">{schedule.length}</h2>
                            <p className="text-blue-600 text-sm font-bold mt-2 flex items-center gap-1"><Users size={14}/> In 2 Branches</p>
                        </div>
                    </div>

                    {/* Today's Classes List */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-blue-600"/> Today's Teaching Schedule</h3>
                        <div className="overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="text-slate-400 text-xs font-black uppercase tracking-widest border-b">
                                    <th className="pb-4">Time</th>
                                    <th className="pb-4">Subject</th>
                                    <th className="pb-4">Class</th>
                                    <th className="pb-4 text-right">Location</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {schedule.map((item, i) => (
                                    <tr key={i} className="group hover:bg-slate-50 transition">
                                        <td className="py-4 font-bold text-blue-600">{item.timeSlot}</td>
                                        <td className="py-4 font-bold text-slate-800">{item.subject}</td>
                                        <td className="py-4">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{item.branch} Sem {item.semester}</span>
                                        </td>
                                        <td className="py-4 text-right font-medium text-slate-500">Room {item.roomNumber}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;