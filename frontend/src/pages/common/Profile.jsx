import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axios';
import { User, Mail, Shield, IdCard, Briefcase, GraduationCap, Phone, Lock, Activity } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(user.status || 'FREE');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = { phoneNumber: phone, password, status };
            await api.put(`/auth/update-profile/${user.id}`, payload);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Update failed. Please try again.");
        }
    };

    // Helper to render Info Cards
    const InfoCard = ({ icon: Icon, label, value }) => (
        <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600 mr-4">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-gray-800">{value || 'N/A'}</p>
            </div>
        </div>
    );

    return (
        <div className="p-8 ml-64 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">

                {/* 1. Hero Profile Header */}
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex items-end -mt-16 mb-6">
                            <div className="p-2 bg-white rounded-3xl shadow-lg">
                                <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500">
                                    <User size={48} />
                                </div>
                            </div>
                            <div className="ml-6 mb-2">
                                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        {/* 2. Professional Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InfoCard icon={Mail} label="Email Address" value={user.email} />

                            {/* Student Specific Fields */}
                            {user.role === 'STUDENT' && (
                                <>
                                    <InfoCard icon={IdCard} label="Roll Number" value={user.rollNumber} />
                                    <InfoCard icon={GraduationCap} label="Branch" value={user.branch} />
                                    <InfoCard icon={Activity} label="Semester" value={user.semester} />
                                </>
                            )}

                            {/* Faculty Specific Fields */}
                            {user.role === 'FACULTY' && (
                                <>
                                    <InfoCard icon={Briefcase} label="Employee ID" value={user.employeeId} />
                                    <InfoCard icon={Shield} label="Department" value={user.department} />
                                    <InfoCard icon={Activity} label="Live Status" value={user.status} />
                                </>
                            )}

                            {/* Admin Specific */}
                            {user.role === 'ADMIN' && (
                                <InfoCard icon={Shield} label="Access Level" value="Full System Control" />
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Action Section (Edit Profile) */}
                {(user.role === 'STUDENT' || user.role === 'FACULTY') && (
                    <div className="bg-white rounded-3xl shadow-lg p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Lock className="text-blue-600" size={20} /> Update Account Security
                        </h2>

                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <Phone size={16} /> New Phone Number
                                </label>
                                <input
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="Enter 10-digit mobile"
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <Lock size={16} /> New Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="Min. 6 characters"
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Faculty only can change status here too */}
                            {user.role === 'FACULTY' && (
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-600">Quick Status Update</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                    >
                                        <option value="FREE">Free</option>
                                        <option value="BUSY">Busy</option>
                                        <option value="IN_CLASS">In Class</option>
                                        <option value="ON_LEAVE">On Leave</option>
                                    </select>
                                </div>
                            )}

                            <div className="md:col-span-2 pt-4">
                                <button className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-lg transition duration-300">
                                    Update Profile Information
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;