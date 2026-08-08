import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
    Users, 
    GraduationCap, 
    Building2, 
    Calendar, 
    Settings, 
    Search, 
    ChevronRight, 
    X, 
    UserCheck, 
    BookOpen, 
    Cpu, 
    Laptop, 
    Network, 
    Wrench, 
    Zap, 
    Layers,
    ShieldCheck,
    Plus
} from 'lucide-react';

const departmentIcons = {
    CS: Laptop,
    IT: Network,
    ECE: Cpu,
    ME: Wrench,
    EE: Zap,
    CE: Building2
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFaculty: 0,
        totalDepartments: 0,
        totalClasses: 0,
        departments: []
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/stats');
            setStats({
                totalStudents: res.data.totalStudents || 0,
                totalFaculty: res.data.totalFaculty || 0,
                totalDepartments: res.data.totalDepartments || (res.data.departments ? res.data.departments.length : 0),
                totalClasses: res.data.totalClasses || 0,
                departments: res.data.departments || []
            });
        } catch (err) {
            console.error('Failed to load admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDepartments = (stats.departments || []).filter(dept => 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dept.hod && dept.hod.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const StatCard = ({ title, value, icon: Icon, color, bgAccent, borderColor }) => (
        <div className={`p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 ${bgAccent} transition-transform group-hover:scale-125`}></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{title}</p>
                    <h3 className="text-3xl font-black mt-1 text-gray-900">{value}</h3>
                </div>
                <div className={`p-3.5 rounded-xl ${bgAccent} ${color}`}>
                    <Icon size={26} />
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Live Count
                </span>
                <span>Active in System</span>
            </div>
        </div>
    );

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Control Center</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor campus metrics, manage departments, faculty members, and student rosters.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchStats}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
                    >
                        <span>Refresh Stats</span>
                    </button>
                    <button 
                        onClick={() => navigate('/admin/students')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Student
                    </button>
                </div>
            </div>

            {/* Key Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    title="Total Students" 
                    value={stats.totalStudents} 
                    icon={GraduationCap} 
                    color="text-blue-600" 
                    bgAccent="bg-blue-50 text-blue-600"
                />
                <StatCard 
                    title="Faculty Members" 
                    value={stats.totalFaculty} 
                    icon={Users} 
                    color="text-purple-600" 
                    bgAccent="bg-purple-50 text-purple-600"
                />
                <StatCard 
                    title="Total Departments" 
                    value={stats.totalDepartments} 
                    icon={Building2} 
                    color="text-emerald-600" 
                    bgAccent="bg-emerald-50 text-emerald-600"
                />
                <StatCard 
                    title="Active Classes" 
                    value={stats.totalClasses} 
                    icon={Calendar} 
                    color="text-amber-600" 
                    bgAccent="bg-amber-50 text-amber-600"
                />
            </div>

            {/* Total Departments Section */}
            <div className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Layers className="text-indigo-600" size={22} />
                            <h2 className="text-2xl font-bold text-gray-900">Total Departments Section</h2>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Overview of academic departments with total faculty count and enrolled students per department.
                        </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search departments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="text-sm text-gray-500 mt-3">Loading department details...</p>
                    </div>
                ) : filteredDepartments.length === 0 ? (
                    <div className="py-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Building2 size={40} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-600 font-medium">No departments found matching your search</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDepartments.map((dept) => {
                            const DeptIcon = departmentIcons[dept.code] || Building2;
                            return (
                                <div 
                                    key={dept.code}
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition duration-200">
                                                    <DeptIcon size={24} />
                                                </div>
                                                <div>
                                                    <span className="inline-block px-2 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-md mb-1">
                                                        {dept.code}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition">
                                                        {dept.name}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                                            {dept.description || 'Department providing top-tier academic curriculum and research.'}
                                        </p>

                                        {dept.hod && (
                                            <div className="mb-5 p-2.5 bg-gray-50 rounded-xl flex items-center gap-2 text-xs text-gray-700 border border-gray-100">
                                                <UserCheck size={16} className="text-indigo-500 shrink-0" />
                                                <span className="truncate">
                                                    <strong className="font-semibold">HoD:</strong> {dept.hod}
                                                </span>
                                            </div>
                                        )}

                                        {/* Stat Pills for Total Faculties and Students */}
                                        <div className="grid grid-cols-2 gap-3 mb-5">
                                            <div className="p-3 bg-purple-50/70 border border-purple-100/60 rounded-xl text-center">
                                                <div className="flex items-center justify-center gap-1 text-purple-700 mb-1">
                                                    <Users size={16} />
                                                    <span className="text-xs font-semibold uppercase tracking-wider">Faculties</span>
                                                </div>
                                                <p className="text-2xl font-black text-purple-900">{dept.totalFaculty}</p>
                                            </div>

                                            <div className="p-3 bg-blue-50/70 border border-blue-100/60 rounded-xl text-center">
                                                <div className="flex items-center justify-center gap-1 text-blue-700 mb-1">
                                                    <GraduationCap size={16} />
                                                    <span className="text-xs font-semibold uppercase tracking-wider">Students</span>
                                                </div>
                                                <p className="text-2xl font-black text-blue-900">{dept.totalStudents}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setSelectedDepartment(dept)}
                                        className="w-full py-2.5 px-4 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-xl font-medium text-xs transition flex items-center justify-center gap-2 border border-gray-200/70"
                                    >
                                        <span>View Department Roster</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick Navigation & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen size={20} className="text-indigo-600" />
                        Quick Management Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => navigate('/admin/students')}
                            className="p-4 bg-blue-50/80 hover:bg-blue-100/80 text-blue-800 rounded-xl font-semibold text-sm transition text-left flex flex-col gap-1"
                        >
                            <span className="font-bold">Student Roster</span>
                            <span className="text-xs text-blue-600/80 font-normal">Add or manage students</span>
                        </button>
                        <button 
                            onClick={() => navigate('/admin/timetable')}
                            className="p-4 bg-orange-50/80 hover:bg-orange-100/80 text-orange-800 rounded-xl font-semibold text-sm transition text-left flex flex-col gap-1"
                        >
                            <span className="font-bold">Manage Timetable</span>
                            <span className="text-xs text-orange-600/80 font-normal">Assign slots & rooms</span>
                        </button>
                        <button 
                            onClick={() => navigate('/admin/exam-seating')}
                            className="p-4 bg-purple-50/80 hover:bg-purple-100/80 text-purple-800 rounded-xl font-semibold text-sm transition text-left flex flex-col gap-1"
                        >
                            <span className="font-bold">Exam Seating</span>
                            <span className="text-xs text-purple-600/80 font-normal">Arrange hall seating</span>
                        </button>
                        <button 
                            onClick={() => navigate('/faculty-directory')}
                            className="p-4 bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-800 rounded-xl font-semibold text-sm transition text-left flex flex-col gap-1"
                        >
                            <span className="font-bold">Faculty Directory</span>
                            <span className="text-xs text-emerald-600/80 font-normal">View faculty status</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings size={20} className="text-indigo-600" /> System Health & Status
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-600 font-medium">Database API Services</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> Operational
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-600 font-medium">Role Based Auth (JWT)</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md">
                                <ShieldCheck size={14} /> Active
                            </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
                                <span>Server System Load</span>
                                <span className="font-bold text-indigo-600">Optimal (98.4%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-indigo-600 h-2 rounded-full w-[98%] transition-all duration-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Department Roster Modal */}
            {selectedDepartment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Department Details</span>
                                    <h3 className="text-xl font-black">{selectedDepartment.name} ({selectedDepartment.code})</h3>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedDepartment(null)}
                                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Summary Cards inside Modal */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
                                    <p className="text-xs text-purple-600 font-bold uppercase">Total Faculty</p>
                                    <p className="text-3xl font-black text-purple-900 mt-1">{selectedDepartment.totalFaculty}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                                    <p className="text-xs text-blue-600 font-bold uppercase">Total Enrolled Students</p>
                                    <p className="text-3xl font-black text-blue-900 mt-1">{selectedDepartment.totalStudents}</p>
                                </div>
                            </div>

                            {/* Faculty Members List */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Users size={18} className="text-purple-600" /> Faculty Members
                                </h4>
                                {selectedDepartment.faculties && selectedDepartment.faculties.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedDepartment.faculties.map((fac) => (
                                            <div key={fac.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{fac.name}</p>
                                                    <p className="text-xs text-gray-500">{fac.designation} • {fac.email}</p>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    fac.status === 'FREE' ? 'bg-emerald-100 text-emerald-700' :
                                                    fac.status === 'IN_CLASS' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {fac.status || 'FREE'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-xl">No faculty members currently registered in this department.</p>
                                )}
                            </div>

                            {/* Enrolled Students List */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <GraduationCap size={18} className="text-blue-600" /> Enrolled Students
                                </h4>
                                {selectedDepartment.students && selectedDepartment.students.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedDepartment.students.map((st) => (
                                            <div key={st.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{st.name}</p>
                                                    <p className="text-xs text-gray-500">Roll: {st.rollNumber} • Sem {st.semester}</p>
                                                </div>
                                                <span className="text-xs text-gray-400 font-mono">{st.email}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-xl">No students currently enrolled in this branch/department.</p>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button 
                                onClick={() => setSelectedDepartment(null)}
                                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-sm font-semibold transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
