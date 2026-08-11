import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { UserPlus, Users, Edit3, Trash2, Search, Save, X, GraduationCap, CheckCircle } from 'lucide-react';
import { BRANCHES } from '../../api/constants';

const StudentManagement = () => {
    const [studentList, setStudentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [toastMessage, setToastMessage] = useState(null);

    // New student form
    const [student, setStudent] = useState({
        name: '',
        email: '',
        rollNumber: '',
        password: 'student123',
        branch: '',
        semester: '',
        course: 'B.Tech',
        phoneNumber: ''
    });

    // Editing user profile state
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/students');
            setStudentList(res.data);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/students', student);
            const created = res.data;
            showToast(`Student ${created.name || student.name} created! Login Email: ${created.email} / Roll: ${created.rollNumber} | Password: ${created.password || 'student123'}`);
            setStudent({ name: '', email: '', rollNumber: '', password: 'student123', branch: '', semester: '', course: 'B.Tech', phoneNumber: '' });
            fetchStudents();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error adding student. Check if Email or Roll Number already exists.");
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            rollNumber: user.rollNumber || '',
            branch: user.branch || '',
            course: user.course || 'B.Tech',
            semester: user.semester || 1,
            phoneNumber: user.phoneNumber || '',
            password: ''
        });
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;
        setSaveLoading(true);
        try {
            const res = await api.put(`/admin/users/${editingUser.id}`, editForm);
            showToast(`Profile updated for ${res.data.user?.name || editForm.name}`);
            setEditingUser(null);
            fetchStudents();
        } catch (err) {
            console.error('Failed to update student profile:', err);
            alert(err.response?.data?.message || 'Error updating student');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            showToast(`Student ${name} deleted successfully`);
            if (editingUser?.id === id) setEditingUser(null);
            fetchStudents();
        } catch (err) {
            console.error(err);
            alert('Failed to delete student');
        }
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const filteredStudents = studentList.filter(s => 
        (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.branch && s.branch.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen">
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle size={20} className="text-emerald-300" />
                    <span className="text-sm font-semibold">{toastMessage}</span>
                </div>
            )}

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-md">
                            <UserPlus size={26} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Student Roster & Management</h1>
                            <p className="text-sm text-gray-500">Create new student accounts or edit existing student profiles.</p>
                        </div>
                    </div>
                </div>

                {/* Add New Student Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <UserPlus size={20} className="text-blue-600" /> Create New Student Account
                    </h3>

                    <form onSubmit={handleAddStudent} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Full Name</label>
                                <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                       placeholder="e.g. John Doe" value={student.name}
                                       onChange={e => setStudent({...student, name: e.target.value})} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Email Address</label>
                                <input required type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                       placeholder="john@college.com" value={student.email}
                                       onChange={e => setStudent({...student, email: e.target.value})} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Roll Number (ID No.)</label>
                                <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                       placeholder="CS2024001" value={student.rollNumber}
                                       onChange={e => setStudent({...student, rollNumber: e.target.value})} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Branch</label>
                                <select
                                    required
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    value={student.branch}
                                    onChange={e => setStudent({...student, branch: e.target.value})}
                                >
                                    <option value="">Select Branch</option>
                                    {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name} ({b.id})</option>)}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Semester</label>
                                <input required type="number" min="1" max="8" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                       placeholder="1 - 8" value={student.semester}
                                       onChange={e => setStudent({...student, semester: e.target.value})} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Phone Number</label>
                                <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                       placeholder="+1 555-0101" value={student.phoneNumber}
                                       onChange={e => setStudent({...student, phoneNumber: e.target.value})} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Account Password</label>
                                <input type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                       placeholder="Default: student123" value={student.password}
                                       onChange={e => setStudent({...student, password: e.target.value})} />
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                            <p className="text-xs text-gray-400 italic">Default Password: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">student123</code></p>
                            <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition shadow-md">
                                Create Student Account
                            </button>
                        </div>
                    </form>
                </div>

                {/* Enrolled Students Directory Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Users size={20} className="text-blue-600" /> Registered Students Directory ({studentList.length})
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">Click any student card to open and edit their full profile.</p>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by name, roll no, branch..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <p className="text-center py-10 text-gray-500 text-sm">No students match your search.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredStudents.map((st) => (
                                <div 
                                    key={st.id}
                                    onClick={() => openEditModal(st)}
                                    className="p-4 bg-gray-50 hover:bg-blue-50/70 border border-gray-200/80 rounded-xl transition cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                                            {st.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition">{st.name}</h4>
                                            <p className="text-xs text-gray-500">Roll: <span className="font-mono font-semibold">{st.rollNumber}</span> • Sem {st.semester || 1}</p>
                                            <p className="text-[11px] text-gray-400">{st.branch || 'CS'} • {st.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(st);
                                        }}
                                        className="p-2 text-blue-600 bg-white hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition shrink-0"
                                    >
                                        <Edit3 size={14} /> Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900">Edit Student Profile</h3>
                            <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name</label>
                                <input required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email Address</label>
                                <input required type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Roll Number</label>
                                    <input required value={editForm.rollNumber} onChange={e => setEditForm({...editForm, rollNumber: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Branch</label>
                                    <select value={editForm.branch} onChange={e => setEditForm({...editForm, branch: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                                        {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name} ({b.id})</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Semester</label>
                                    <input type="number" min="1" max="8" value={editForm.semester} onChange={e => setEditForm({...editForm, semester: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                                    <input value={editForm.phoneNumber} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">New Password (Optional)</label>
                                <input type="password" placeholder="Leave blank to keep current" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                            </div>

                            <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                                <button type="button" onClick={() => handleDeleteUser(editingUser.id, editingUser.name)} className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1">
                                    <Trash2 size={14} /> Delete
                                </button>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold">Cancel</button>
                                    <button type="submit" disabled={saveLoading} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md">{saveLoading ? 'Saving...' : 'Save Profile'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
