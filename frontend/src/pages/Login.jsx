import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data);

            // Redirect based on role
            const role = res.data.role;
            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'FACULTY') navigate('/faculty');
            else navigate('/student');
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">College Portal</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" required className="w-full mt-1 p-2 border rounded-md"
                               onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" required className="w-full mt-1 p-2 border rounded-md"
                               onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/signup" className="text-blue-600 font-bold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;