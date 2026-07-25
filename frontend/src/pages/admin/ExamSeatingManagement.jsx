import React, { useState } from 'react';
import api from '../../api/axios';
import { MapPin } from 'lucide-react';

const ExamSeatingManagement = () => {
    const [seating, setSeating] = useState({ rollNumber: '', building: '', floor: '', classroom: '', benchNumber: '', seatNumber: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/exam-seating', seating);
            alert("Seat Assigned Successfully!");
        } catch (err) { alert("Check if Roll Number is valid."); }
    };

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><MapPin/> Exam Seating Management</h1>
            <form onSubmit={handleSubmit} className="max-w-lg bg-white p-8 rounded-xl shadow-md space-y-4">
                <input className="w-full p-2 border rounded" placeholder="Student Roll Number" onChange={e => setSeating({...seating, rollNumber: e.target.value})} required />
                <input className="w-full p-2 border rounded" placeholder="Building Name" onChange={e => setSeating({...seating, building: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                    <input className="w-full p-2 border rounded" placeholder="Floor" onChange={e => setSeating({...seating, floor: e.target.value})} />
                    <input className="w-full p-2 border rounded" placeholder="Classroom" onChange={e => setSeating({...seating, classroom: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input className="w-full p-2 border rounded" type="number" placeholder="Bench No" onChange={e => setSeating({...seating, benchNumber: e.target.value})} />
                    <input className="w-full p-2 border rounded" type="number" placeholder="Seat No" onChange={e => setSeating({...seating, seatNumber: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Assign Seat</button>
            </form>
        </div>
    );
};

export default ExamSeatingManagement;