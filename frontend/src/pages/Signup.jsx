import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { BRANCHES, DEPARTMENTS } from '../api/constants';
const Signup = () => {
    const [role, setRole] = useState('STUDENT');
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

                <div className="flex mb-6 border-b">
                    <button onClick={() => setRole('STUDENT')} className={`flex-1 py-2 ${role === 'STUDENT' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Student</button>
                    <button onClick={() => setRole('FACULTY')} className={`flex-1 py-2 ${role === 'FACULTY' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Faculty</button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" placeholder="Full Name" onChange={handleChange} className="p-2 border rounded" required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded" required />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded" required />

                    {role === 'STUDENT' ? (
                        <>
                            {/* ... name, email, roll number ... */}
                            <select
                                name="branch"
                                onChange={handleChange}
                                className="p-2 border rounded"
                                required
                            >
                                <option value="">Select Branch</option>
                                {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </>
                    ) : (
                        <>
                            {/* ... employeeId ... */}
                            <select
                                name="department"
                                onChange={handleChange}
                                className="p-2 border rounded"
                                required
                            >
                                <option value="">Select Department</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </>
                    )}

                    <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-2 rounded mt-4">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;