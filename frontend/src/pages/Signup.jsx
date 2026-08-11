import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [role, setRole] = useState('STUDENT');
    const [formData, setFormData] = useState({});
    const [departments, setDepartments] = useState([]);
    const [loadingDepts, setLoadingDepts] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments');
            setDepartments(res.data || []);
        } catch (err) {
            console.error("Failed to fetch departments:", err);
        } finally {
            setLoadingDepts(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = role === 'STUDENT' ? '/auth/signup/student' : '/auth/signup/faculty';
        try {
            await api.post(endpoint, formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed");
        }
    };

    // Find courses for currently selected department (if student)
    const selectedDeptObj = departments.find(d => d.name === formData.branch || d.code === formData.branch);
    const availableCourses = selectedDeptObj?.courses || [];

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Create Account</h2>

                <div className="flex mb-6 border-b border-gray-200">
                    <button 
                        type="button"
                        onClick={() => { setRole('STUDENT'); setFormData({}); }} 
                        className={`flex-1 py-3 font-semibold text-sm transition ${role === 'STUDENT' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Student Signup
                    </button>
                    <button 
                        type="button"
                        onClick={() => { setRole('FACULTY'); setFormData({}); }} 
                        className={`flex-1 py-3 font-semibold text-sm transition ${role === 'FACULTY' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Faculty Signup
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        name="name" 
                        placeholder="Full Name" 
                        onChange={handleChange} 
                        className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        required 
                    />
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="Email Address" 
                        onChange={handleChange} 
                        className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        required 
                    />
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        required 
                    />

                    {role === 'STUDENT' ? (
                        <>
                            <input 
                                name="rollNumber" 
                                placeholder="Roll Number (e.g. CS101)" 
                                onChange={handleChange} 
                                className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                required 
                            />

                            {/* Department / Branch selection */}
                            {departments.length > 0 ? (
                                <select
                                    name="branch"
                                    onChange={handleChange}
                                    className="p-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">Select Department / Branch</option>
                                    {departments.map(d => (
                                        <option key={d.id || d.code} value={d.code}>
                                            {d.name} ({d.code})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    name="branch"
                                    placeholder="Department / Branch Code (e.g. CS)"
                                    onChange={handleChange}
                                    className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                />
                            )}

                            {/* Course selection */}
                            {availableCourses.length > 0 ? (
                                <select
                                    name="course"
                                    onChange={handleChange}
                                    className="p-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">Select Course</option>
                                    {availableCourses.map(c => (
                                        <option key={c.id || c.code} value={c.name}>
                                            {c.name} ({c.duration})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    name="course"
                                    placeholder="Course Name (e.g. B.Tech)"
                                    onChange={handleChange}
                                    className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                />
                            )}

                            <select
                                name="semester"
                                onChange={handleChange}
                                className="p-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                required
                            >
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={s}>Semester {s}</option>
                                ))}
                            </select>

                            <input 
                                name="phoneNumber" 
                                placeholder="Phone Number" 
                                onChange={handleChange} 
                                className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 md:col-span-2" 
                            />
                        </>
                    ) : (
                        <>
                            <input 
                                name="employeeId" 
                                placeholder="Employee ID (e.g. EMP101)" 
                                onChange={handleChange} 
                                className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                required 
                            />

                            {/* Department selection */}
                            {departments.length > 0 ? (
                                <select
                                    name="department"
                                    onChange={handleChange}
                                    className="p-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => (
                                        <option key={d.id || d.code} value={d.name}>
                                            {d.name} ({d.code})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    name="department"
                                    placeholder="Department Name"
                                    onChange={handleChange}
                                    className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                />
                            )}

                            <input 
                                name="designation" 
                                placeholder="Designation (e.g. Assistant Professor)" 
                                onChange={handleChange} 
                                className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                            />

                            <input 
                                name="phoneNumber" 
                                placeholder="Phone Number" 
                                onChange={handleChange} 
                                className="p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                            />
                        </>
                    )}

                    <button type="submit" className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md mt-2">
                        Complete Registration
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
