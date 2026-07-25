import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const FacultyWeeklySchedule = () => {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState([]);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        const fetchWeekly = async () => {
            const res = await api.get(`/timetable/faculty/weekly/${user.id}`);
            setSchedule(res.data);
        };
        fetchWeekly();
    }, [user.id]);

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">My Weekly Schedule</h1>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 text-white">
                    <tr>
                        <th className="p-4">Day</th>
                        <th className="p-4">Schedule Details</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {days.map(day => (
                        <tr key={day}>
                            <td className="p-4 font-bold text-blue-600 w-32">{day}</td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-4">
                                    {schedule.filter(s => s.dayOfWeek === day).length > 0 ? (
                                        schedule.filter(s => s.dayOfWeek === day).map((item, i) => (
                                            <div key={i} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="font-bold">{item.subject}</p>
                                                <p className="text-xs text-gray-600">{item.timeSlot}</p>
                                                <p className="text-xs text-blue-700">Room: {item.roomNumber} | {item.branch}</p>
                                            </div>
                                        ))
                                    ) : <span className="text-gray-400 italic">No classes</span>}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacultyWeeklySchedule;