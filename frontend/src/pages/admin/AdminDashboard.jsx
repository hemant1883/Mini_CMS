import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { BRANCHES, DEPARTMENTS } from '../../api/constants';
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
    Plus,
    Edit3,
    Trash2,
    Save,
    Phone,
    Mail,
    Lock,
    Award,
    CheckCircle,
    User,
    Filter
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

    // List Modal state (for Students list or Faculty list)
    const [activeListRole, setActiveListRole] = useState(null); // 'STUDENT' | 'FACULTY' | null
    const [userList, setUserList] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [listSearch, setListSearch] = useState('');

    // Editing User Profile state
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

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

    const openListModal = async (role) => {
        setActiveListRole(role);
        setListSearch('');
        setListLoading(true);
        try {
            if (role === 'STUDENT') {
                const res = await api.get('/admin/students');
                setUserList(res.data);
            } else if (role === 'FACULTY') {
                const res = await api.get('/admin/faculty');
                setUserList(res.data);
            }
        } catch (err) {
            console.error(`Failed to fetch ${role} list:`, err);
        } finally {
            setListLoading(false);
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            rollNumber: user.rollNumber || '',
            employeeId: user.employeeId || '',
            branch: user.branch || '',
            course: user.course || 'B.Tech',
            semester: user.semester || 1,
            department: user.department || 'Computer Science',
            designation: user.designation || 'Assistant Professor',
            phoneNumber: user.phoneNumber || '',
            status: user.status || 'FREE',
            password: '' // empty means no password change
        });
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;
        setSaveLoading(true);
        try {
            const res = await api.put(`/admin/users/${editingUser.id}`, editForm);
            const updatedUser = res.data.user || { ...editingUser, ...editForm };

            showToast(`Profile updated successfully for ${updatedUser.name}`);

            // Update user inside userList
            setUserList(prev => prev.map(u => (u.id == editingUser.id ? { ...u, ...updatedUser } : u)));

            // Refetch dashboard stats
            fetchStats();

            // Close editing modal
            setEditingUser(null);
        } catch (err) {
            console.error('Failed to update user profile:', err);
            alert(err.response?.data?.message || 'Failed to update user profile');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            return;
        }
        try {
            await api.delete(`/admin/users/${userId}`);
            showToast(`User ${userName} deleted successfully`);
            setUserList(prev => prev.filter(u => u.id !== userId));
            fetchStats();
            if (editingUser?.id === userId) {
                setEditingUser(null);
            }
        } catch (err) {
            console.error('Failed to delete user:', err);
            alert('Error deleting user');
        }
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const filteredDepartments = (stats.departments || []).filter(dept => 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dept.hod && dept.hod.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredUserList = userList.filter(u => {
        if (activeListRole && u.role && u.role !== activeListRole) return false;
        const query = listSearch.trim().toLowerCase();
        if (!query) return true;
        return (
            (u.name && u.name.toLowerCase().includes(query)) ||
            (u.email && u.email.toLowerCase().includes(query)) ||
            (u.rollNumber && String(u.rollNumber).toLowerCase().includes(query)) ||
            (u.employeeId && String(u.employeeId).toLowerCase().includes(query)) ||
            (u.branch && u.branch.toLowerCase().includes(query)) ||
            (u.department && u.department.toLowerCase().includes(query)) ||
            (u.course && u.course.toLowerCase().includes(query))
        );
    });

    const StatCard = ({ title, value, icon: Icon, color, bgAccent, onClick, clickableText }) => (
        <div 
            onClick={onClick}
            className={`p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 relative overflow-hidden group ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-200' : ''}`}
        >
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
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Live Count
                </span>
                <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-1">
                    {clickableText || 'Click to view list'} <ChevronRight size={12} />
                </span>
            </div>
        </div>
    );

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen relative">
            {/* Notification Toast */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle size={20} className="text-emerald-300" />
                    <span className="text-sm font-semibold">{toastMessage}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Control Center</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Click on <span className="font-semibold text-gray-700">Students</span> or <span className="font-semibold text-gray-700">Faculty</span> cards below to view, edit, or manage user profiles.
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
                        onClick={() => openListModal('STUDENT')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                    >
                        <Plus size={16} /> Manage All Students
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
                    onClick={() => openListModal('STUDENT')}
                    clickableText="View All Students"
                />
                <StatCard 
                    title="Faculty Members" 
                    value={stats.totalFaculty} 
                    icon={Users} 
                    color="text-purple-600" 
                    bgAccent="bg-purple-50 text-purple-600"
                    onClick={() => openListModal('FACULTY')}
                    clickableText="View All Faculty"
                />
                <StatCard 
                    title="Total Departments" 
                    value={stats.totalDepartments} 
                    icon={Building2} 
                    color="text-emerald-600" 
                    bgAccent="bg-emerald-50 text-emerald-600"
                    onClick={() => {
                        const el = document.getElementById('departments-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    clickableText="Explore Departments"
                />
                <StatCard 
                    title="Active Classes" 
                    value={stats.totalClasses} 
                    icon={Calendar} 
                    color="text-amber-600" 
                    bgAccent="bg-amber-50 text-amber-600"
                    onClick={() => navigate('/admin/timetable')}
                    clickableText="Manage Schedule"
                />
            </div>

            {/* Total Departments Section */}
            <div id="departments-section" className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Layers className="text-indigo-600" size={22} />
                            <h2 className="text-2xl font-bold text-gray-900">Total Departments Section</h2>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Overview of academic departments. Click <span className="font-semibold text-gray-700">"View Department Roster"</span> on any card to edit specific members.
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
                                            <div 
                                                onClick={() => openListModal('FACULTY')}
                                                className="p-3 bg-purple-50/70 hover:bg-purple-100/80 cursor-pointer transition border border-purple-100/60 rounded-xl text-center"
                                            >
                                                <div className="flex items-center justify-center gap-1 text-purple-700 mb-1">
                                                    <Users size={16} />
                                                    <span className="text-xs font-semibold uppercase tracking-wider">Faculties</span>
                                                </div>
                                                <p className="text-2xl font-black text-purple-900">{dept.totalFaculty}</p>
                                            </div>

                                            <div 
                                                onClick={() => openListModal('STUDENT')}
                                                className="p-3 bg-blue-50/70 hover:bg-blue-100/80 cursor-pointer transition border border-blue-100/60 rounded-xl text-center"
                                            >
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
                            onClick={() => openListModal('STUDENT')}
                            className="p-4 bg-blue-50/80 hover:bg-blue-100/80 text-blue-800 rounded-xl font-semibold text-sm transition text-left flex flex-col gap-1"
                        >
                            <span className="font-bold flex items-center justify-between">
                                Student List & Profiles
                                <ChevronRight size={16} />
                            </span>
                            <span className="text-xs text-blue-600/80 font-normal">View & edit student records</span>
                        </button>

                        <button 
                            onClick={() => openListModal('FACULTY')}
                            className="p-4 bg-purple-50/80 hover:bg-purple-100/80 text-purple-800 rounded-xl font-semibold text-sm transition text-left flex flex-col gap-1"
                        >
                            <span className="font-bold flex items-center justify-between">
                                Faculty List & Profiles
                                <ChevronRight size={16} />
                            </span>
                            <span className="text-xs text-purple-600/80 font-normal">View & edit faculty profiles</span>
                        </button>

                        <button 
                            onClick={() => navigate('/admin/timetable')}
                            className="p-4 bg-orange-50/80 hover:bg-orange-100/80 text-orange-800 rounded-xl font-semibold text-sm transition text-left flex flex-col gap-1"
                        >
                            <span className="font-bold">Manage Timetable</span>
                            <span className="text-xs text-orange-600/80 font-normal">Assign slots & rooms</span>
                        </button>

                        <button 
                            onClick={() => navigate('/admin/seating')}
                            className="p-4 bg-amber-50/80 hover:bg-amber-100/80 text-amber-800 rounded-xl font-semibold text-sm transition text-left flex flex-col gap-1"
                        >
                            <span className="font-bold">Exam Seating</span>
                            <span className="text-xs text-amber-600/80 font-normal">Arrange hall seating</span>
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

            {/* =========================================
                MODAL 1: STUDENT / FACULTY LIST ROSTER MODAL
               ========================================= */}
            {activeListRole && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* List Header */}
                        <div className={`p-6 text-white flex items-center justify-between ${
                            activeListRole === 'STUDENT' ? 'bg-blue-600' : 'bg-purple-600'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl">
                                    {activeListRole === 'STUDENT' ? <GraduationCap size={28} /> : <Users size={28} />}
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/80">Management Directory</span>
                                    <h3 className="text-2xl font-black">
                                        {activeListRole === 'STUDENT' ? 'All Registered Students' : 'All Faculty Members'}
                                    </h3>
                                </div>
                            </div>
                            <button 
                                onClick={() => setActiveListRole(null)}
                                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Search & Actions Bar */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder={activeListRole === 'STUDENT' ? "Search by Name, Roll No, Branch..." : "Search by Name, Employee ID, Dept..."}
                                    value={listSearch}
                                    onChange={(e) => setListSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <span className="text-xs font-medium text-gray-500">
                                Showing {filteredUserList.length} of {userList.length} profiles
                            </span>
                        </div>

                        {/* List Grid Content */}
                        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-gray-50/50">
                            {listLoading ? (
                                <div className="py-16 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                                    <p className="text-sm text-gray-500 mt-3">Fetching directory entries...</p>
                                </div>
                            ) : filteredUserList.length === 0 ? (
                                <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
                                    <User size={40} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-600 font-medium">No {activeListRole.toLowerCase()} profiles found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredUserList.map((user) => (
                                        <div 
                                            key={user.id}
                                            onClick={() => openEditModal(user)}
                                            className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                                                    user.role === 'STUDENT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition text-sm">
                                                            {user.name}
                                                        </h4>
                                                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                            {user.rollNumber || user.employeeId || `ID:${user.id}`}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {user.role === 'STUDENT' ? (
                                                            `${user.branch || 'General'} • Sem ${user.semester || 1} • ${user.course || 'B.Tech'}`
                                                        ) : (
                                                            `${user.designation || 'Faculty'} • ${user.department || 'General'}`
                                                        )}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditModal(user);
                                                    }}
                                                    className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                                                >
                                                    <Edit3 size={14} />
                                                    <span>Edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                                Tip: Click any student or faculty member card to edit profile attributes.
                            </span>
                            <button 
                                onClick={() => setActiveListRole(null)}
                                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
                            >
                                Close Directory
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================
                MODAL 2: EDIT USER PROFILE MODAL
               ========================================= */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Edit Modal Header */}
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                                    <Edit3 size={22} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                                        Edit {editingUser.role === 'STUDENT' ? 'Student' : 'Faculty'} Profile
                                    </span>
                                    <h3 className="text-xl font-black">{editingUser.name}</h3>
                                </div>
                            </div>
                            <button 
                                onClick={() => setEditingUser(null)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Edit Form Body */}
                        <form onSubmit={handleSaveUser} className="p-6 overflow-y-auto space-y-4 flex-1">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        required
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="email" 
                                        required
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* STUDENT Specific Fields */}
                            {editingUser.role === 'STUDENT' && (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Roll Number (ID No)
                                            </label>
                                            <input 
                                                type="text" 
                                                required
                                                value={editForm.rollNumber}
                                                onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Course
                                            </label>
                                            <input 
                                                type="text" 
                                                value={editForm.course}
                                                onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Branch / Major
                                            </label>
                                            <select 
                                                value={editForm.branch}
                                                onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            >
                                                {BRANCHES.map(b => (
                                                    <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Semester
                                            </label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max="8"
                                                value={editForm.semester}
                                                onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* FACULTY Specific Fields */}
                            {editingUser.role === 'FACULTY' && (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Employee ID (ID No)
                                            </label>
                                            <input 
                                                type="text" 
                                                required
                                                value={editForm.employeeId}
                                                onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Department
                                            </label>
                                            <select 
                                                value={editForm.department}
                                                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            >
                                                {DEPARTMENTS.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Designation
                                            </label>
                                            <input 
                                                type="text" 
                                                value={editForm.designation}
                                                onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Current Status
                                            </label>
                                            <select 
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            >
                                                <option value="FREE">Available / Free</option>
                                                <option value="IN_CLASS">In Class</option>
                                                <option value="BUSY">Busy</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Phone Number */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={editForm.phoneNumber}
                                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                        placeholder="+1 555-0101"
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* New Password / Reset */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Reset Password (Leave blank to keep unchanged)
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="password" 
                                        placeholder="New password..."
                                        value={editForm.password}
                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Save / Delete Footer Buttons */}
                            <div className="pt-4 flex items-center justify-between border-t border-gray-100 gap-3">
                                <button 
                                    type="button"
                                    onClick={() => handleDeleteUser(editingUser.id, editingUser.name)}
                                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                                >
                                    <Trash2 size={15} /> Delete Profile
                                </button>

                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={saveLoading}
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        <Save size={15} />
                                        {saveLoading ? 'Saving...' : 'Save Profile Changes'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================
                MODAL 3: DEPARTMENT ROSTER MODAL
               ========================================= */}
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
                                    <Users size={18} className="text-purple-600" /> Faculty Members (Click to edit)
                                </h4>
                                {selectedDepartment.faculties && selectedDepartment.faculties.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedDepartment.faculties.map((fac) => (
                                            <div 
                                                key={fac.id} 
                                                onClick={() => {
                                                    setSelectedDepartment(null);
                                                    openEditModal({ ...fac, role: 'FACULTY', department: selectedDepartment.name });
                                                }}
                                                className="p-3 bg-gray-50 hover:bg-purple-50/60 transition cursor-pointer rounded-xl border border-gray-100 flex items-center justify-between group"
                                            >
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 group-hover:text-purple-700 transition">{fac.name}</p>
                                                    <p className="text-xs text-gray-500">{fac.designation || 'Faculty'} • {fac.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        fac.status === 'FREE' ? 'bg-emerald-100 text-emerald-700' :
                                                        fac.status === 'IN_CLASS' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {fac.status || 'FREE'}
                                                    </span>
                                                    <Edit3 size={15} className="text-gray-400 group-hover:text-purple-600" />
                                                </div>
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
                                    <GraduationCap size={18} className="text-blue-600" /> Enrolled Students (Click to edit)
                                </h4>
                                {selectedDepartment.students && selectedDepartment.students.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedDepartment.students.map((st) => (
                                            <div 
                                                key={st.id} 
                                                onClick={() => {
                                                    setSelectedDepartment(null);
                                                    openEditModal({ ...st, role: 'STUDENT', branch: selectedDepartment.code });
                                                }}
                                                className="p-3 bg-gray-50 hover:bg-blue-50/60 transition cursor-pointer rounded-xl border border-gray-100 flex items-center justify-between group"
                                            >
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition">{st.name}</p>
                                                    <p className="text-xs text-gray-500">Roll: {st.rollNumber} • Sem {st.semester || 1}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400 font-mono">{st.email}</span>
                                                    <Edit3 size={15} className="text-gray-400 group-hover:text-blue-600" />
                                                </div>
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
