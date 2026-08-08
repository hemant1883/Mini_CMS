import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    Calendar, Clock, MapPin, Users,
    BookOpen, Bell, Loader2, ShieldCheck,
    CheckCircle, AlertCircle
} from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [todayClasses, setTodayClasses] = useState([]);
    const [seating, setSeating] = useState(null);
    const [onlineFaculty, setOnlineFaculty] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Logic to fetch all live data
    const fetchDashboardData = async () => {
        try {
            // Get current day (e.g., "Monday")
            const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

            // Fetch Timetable based on logged-in student's branch/sem
            if (user?.branch && user?.semester) {
                const timetableRes = await api.get(`/timetable/student/${user.branch}/${user.semester}`);
                const classesForToday = timetableRes.data.filter(item => item.dayOfWeek === currentDay);
                setTodayClasses(classesForToday);
            }

            // Fetch Exam Seating for this student's roll number
            if (user?.rollNumber) {
                try {
                    const seatingRes = await api.get(`/student/exam-seating/${user.rollNumber}`);
                    setSeating(seatingRes.data);
                } catch (e) {
                    setSeating(null); // Not assigned yet
                }
            }

            // Fetch Faculty Directory to calculate live free count
            const facultyRes = await api.get('/student/faculty-directory');
            const freeCount = facultyRes.data.filter(f => f.status === 'FREE').length;
            setOnlineFaculty(freeCount);

        } catch (err) {
            console.error("Dashboard Sync Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();

            // LIVE UPDATE: Refresh every 10 seconds
            const interval = setInterval(() => {
                fetchDashboardData();
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center ml-64 bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <span className="ml-3 text-slate-500 font-medium">Syncing Dashboard...</span>
            </div>
        );
    }

    return (
        <div className="p-8 ml-64 bg-[#f8fafc] min-h-screen">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, {user.name}</h1>
                    <div className="flex items-center gap-2 mt-1 text-slate-500">
                        <GraduationCap size={16} />
                        <span className="text-sm font-semibold">{user.branch} Department • Semester {user.semester}</span>
                    </div>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-black text-blue-600">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest text-right">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                        </p>
                    </div>
                    <Calendar className="text-slate-300" size={24} />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Classes Today Stat */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><BookOpen size={28}/></div>
                    <div>
                        <p className="text-3xl font-black text-slate-800">{todayClasses.length}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lectures Today</p>
                    </div>
                </div>

                {/* Online Faculty Stat */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden group">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Users size={28}/></div>
                    <div>
                        <p className="text-3xl font-black text-slate-800">{onlineFaculty}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Faculty Online</p>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Live</span>
                    </div>
                </div>

                {/* Exam Seating Stat */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><MapPin size={28}/></div>
                    <div>
                        <p className="text-lg font-black text-slate-800">{seating ? 'Hall Assigned' : 'Not Released'}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Exam Seating</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Today's Timeline */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm p-10 border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <Clock className="text-blue-600" size={28}/> Today's Schedule
                        </h2>
                    </div>

                    <div className="space-y-8">
                        {todayClasses.length > 0 ? todayClasses.map((c, i) => (
                            <div key={i} className="relative pl-10 border-l-2 border-slate-100 pb-2 group">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-4 border-blue-600 rounded-full group-hover:scale-110 transition-transform"></div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-50 p-6 rounded-3xl group-hover:bg-blue-50/50 transition-colors border border-transparent group-hover:border-blue-100">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="font-extrabold text-xl text-slate-800">{c.subject}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                                            <span className="flex items-center gap-1.5"><Users size={14} className="text-blue-400"/> Prof. {c.faculty?.name}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-400"/> Room {c.roomNumber}</span>
                                        </div>
                                    </div>
                                    <div className="inline-flex bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-md shadow-blue-200">
                                        {c.timeSlot}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold text-lg">No classes for today!</p>
                                <p className="text-sm text-slate-300 uppercase font-black tracking-widest mt-1">Check back later or view weekly schedule</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Quick View Cards */}
                <div className="space-y-8">
                    {/* Exam Seating Hub */}
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative">
                            <MapPin size={24} className="text-blue-400"/> Exam Portal
                        </h3>
                        {seating ? (
                            <div className="space-y-8 relative">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Building</span>
                                        <span className="font-black">{seating.building}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Classroom</span>
                                        <span className="font-black text-blue-400">{seating.classroom}</span>
                                    </div>
                                </div>
                                <div className="bg-blue-600 p-8 rounded-[2rem] text-center shadow-xl border border-blue-400/30">
                                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2">My Assigned Seat</p>
                                    <p className="text-5xl font-black tracking-tighter">{seating.benchNumber}{seating.seatNumber}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 border-2 border-dashed border-white/10 rounded-[2rem] text-center">
                                <AlertCircle className="mx-auto text-slate-700 mb-4" size={32}/>
                                <p className="text-slate-500 text-sm font-bold leading-relaxed">Your seating arrangement has not been released yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Academic Quick Identity */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <ShieldCheck size={24} className="text-emerald-500"/> ID Badge
                        </h3>
                        <div className="space-y-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Registration No</span>
                                <span className="font-black text-slate-800">{user.rollNumber}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Department</span>
                                <span className="font-black text-slate-800">{user.branch}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-50">
                                <div className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between">
                                    <span className="text-blue-700 text-xs font-black uppercase tracking-widest">Semester</span>
                                    <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">0{user.semester}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Extra icon mapping for safety
const GraduationCap = ({size, className}) => <Users size={size} className={className} />;
const CustomShieldCheck  = ({size, className}) => <CheckCircle size={size} className={className} />;

export default StudentDashboard;
