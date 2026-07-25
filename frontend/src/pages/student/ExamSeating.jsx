import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext.jsx';

const ExamSeating = () => {
    const { user } = useAuth();
    const [seating, setSeating] = useState(null);
    const rows = [1, 2, 3, 4];
    const cols = [1, 2, 3, 4];

    useEffect(() => {
        const fetchSeating = async () => {
            try {
                // Assuming rollNumber is part of user object or fetched from profile
                const res = await api.get(`/student/exam-seating/CS101`);
                setSeating(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSeating();
    }, []);

    return (
        <div className="p-8 ml-64">
            <h1 className="text-3xl font-bold mb-6">Exam Seating Arrangement</h1>

            {seating ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Info Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                        <div className="space-y-4">
                            <p><strong>Building:</strong> {seating.building}</p>
                            <p><strong>Floor:</strong> {seating.floor}</p>
                            <p><strong>Classroom:</strong> {seating.classroom}</p>
                            <p className="text-2xl text-green-600 font-bold">
                                Your Seat: Bench {seating.benchNumber}, Position {seating.seatNumber}
                            </p>
                        </div>
                    </div>

                    {/* Graphical Grid */}
                    <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
                        <div className="w-full h-8 bg-slate-700 text-white text-center mb-10 rounded">Teacher's Desk</div>
                        <div className="grid grid-cols-4 gap-4">
                            {rows.map(r => cols.map(c => {
                                const isMySeat = seating.benchNumber === r && seating.seatNumber === c;
                                return (
                                    <div key={`${r}-${c}`}
                                         className={`w-16 h-16 border-2 flex items-center justify-center rounded-lg font-bold transition
                                        ${isMySeat ? 'bg-green-500 text-white border-green-700 scale-110 shadow-lg animate-pulse' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                        {String.fromCharCode(64 + r)}{c}
                                    </div>
                                )
                            }))}
                        </div>
                    </div>
                </div>
            ) : <p>Loading seating arrangement...</p>}
        </div>
    );
};

export default ExamSeating;