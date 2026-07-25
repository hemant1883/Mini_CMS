import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Phone, Mail, User } from 'lucide-react';

const FacultyDirectory = () => {
    const [faculties, setFaculties] = useState([]);

    const fetchFaculties = async () => {
        try {
            const res = await api.get('/student/faculty-directory');
            setFaculties(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchFaculties();
        const interval = setInterval(fetchFaculties, 5000); // Polling every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'FREE': return 'bg-green-500';
            case 'BUSY': return 'bg-red-500';
            case 'IN_CLASS': return 'bg-blue-500';
            case 'ON_LEAVE': return 'bg-gray-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Faculty Directory</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {faculties.map((f) => (
                    <div key={f.id} className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden border-l-4 border-blue-600">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-gray-200 p-3 rounded-full text-gray-600">
                                <User size={32} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${getStatusColor(f.status)} animate-pulse`}></span>
                                <span className="text-xs font-bold text-gray-500 uppercase">{f.status}</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{f.name}</h3>
                        <p className="text-blue-600 font-medium mb-4">{f.designation} - {f.department}</p>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2"><Mail size={16}/> {f.email}</div>
                            <div className="flex items-center gap-2"><Phone size={16}/> {f.phoneNumber}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacultyDirectory;