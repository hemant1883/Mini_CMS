import React, { useState } from 'react';
import api from '../../api/axios';
import { UserPlus } from 'lucide-react'; // For professional icons
import { BRANCHES } from '../../api/constants';
const StudentManagement = () => {
    // We include branch and semester so the timetable works!
    const [student, setStudent] = useState({
        name: '',
        email: '',
        rollNumber: '',
        password: 'student123', // Default password
        branch: '',
        semester: '',
        course: 'B.Tech' // Default course
    });

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/students', student);
            alert(`Student ${student.name} added successfully! \nDefault Password: student123`);
            // Clear form after success
            setStudent({ name: '', email: '', rollNumber: '', password: 'student123', branch: '', semester: '', course: 'B.Tech' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error adding student. Check if Email or Roll Number already exists.");
        }
    };

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <UserPlus size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold mb-6 text-gray-700">Add New Student Account</h3>

                    <form onSubmit={handleAddStudent} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Personal Info */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Full Name</label>
                                <input required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                       placeholder="e.g. John Doe" value={student.name}
                                       onChange={e => setStudent({...student, name: e.target.value})} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Email Address</label>
                                <input required type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                       placeholder="john@college.com" value={student.email}
                                       onChange={e => setStudent({...student, email: e.target.value})} />
                            </div>

                            {/* Academic Info */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Roll Number</label>
                                <input required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                       placeholder="CS2024001" value={student.rollNumber}
                                       onChange={e => setStudent({...student, rollNumber: e.target.value})} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Branch</label>
                                <select
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    value={student.branch}
                                    onChange={e => setStudent({...student, branch: e.target.value})}
                                >
                                    <option value="">Select Branch</option>
                                    {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Semester</label>
                                <input required type="number" min="1" max="8" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                       placeholder="1 - 8" value={student.semester}
                                       onChange={e => setStudent({...student, semester: e.target.value})} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">Login Password</label>
                                <input className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                       value="Default: student123" disabled />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition duration-200 shadow-md">
                                Create Student Account
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 italic">
                                Note: The student can change this password later from their profile.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;