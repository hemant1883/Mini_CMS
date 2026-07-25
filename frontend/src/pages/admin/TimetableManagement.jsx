import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Trash2, PlusCircle, Calendar } from 'lucide-react';
import { BRANCHES } from '../../api/constants';
const TimetableManagement = () => {
    const [timetables, setTimetables] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [formData, setFormData] = useState({
        dayOfWeek: 'Monday', timeSlot: '', subject: '', roomNumber: '', branch: '', semester: '', facultyId: ''
    });

    const fetchTimetables = async () => {
        try {
            const res = await api.get('/admin/timetable');
            setTimetables(res.data);
        } catch (err) { console.error("Error loading timetables", err); }
    };

    const fetchFaculties = async () => {
        try {
            const res = await api.get('/admin/faculty');
            setFaculties(res.data);
        } catch (err) { console.error("Error loading faculty dropdown", err); }
    };

    useEffect(() => {
        fetchTimetables();
        fetchFaculties();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, faculty: { id: formData.facultyId } };
            await api.post('/admin/timetable', payload);
            alert("Class Scheduled!");
            setFormData({ ...formData, timeSlot: '', subject: '', roomNumber: '', facultyId: '' });
            fetchTimetables();
        } catch (err) { alert("Error saving timetable"); }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this entry?")) {
            await api.delete(`/admin/timetable/${id}`);
            fetchTimetables();
        }
    };

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Calendar/> Timetable Management</h1>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><PlusCircle size={20}/> New Class</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <select className="w-full p-2 border rounded" value={formData.dayOfWeek} onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}>
                            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d => <option key={d}>{d}</option>)}
                        </select>
                        <input className="w-full p-2 border rounded" placeholder="Time (e.g. 10:00-11:00)" required onChange={e => setFormData({...formData, timeSlot: e.target.value})} />
                        <input className="w-full p-2 border rounded" placeholder="Subject" required onChange={e => setFormData({...formData, subject: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                            <select
                                className="w-full p-2 border rounded"
                                required
                                value={formData.branch}
                                onChange={e => setFormData({...formData, branch: e.target.value})}
                            >
                                <option value="">Select Branch</option>
                                {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>

                            <input
                                className="w-full p-2 border rounded"
                                type="number"
                                placeholder="Sem"
                                value={formData.semester}
                                onChange={e => setFormData({...formData, semester: e.target.value})}
                            />
                        </div>
                        <input className="w-full p-2 border rounded" placeholder="Room" onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
                        <select className="w-full p-2 border rounded" required onChange={e => setFormData({...formData, facultyId: e.target.value})}>
                            <option value="">Select Faculty</option>
                            {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Save</button>
                    </form>
                </div>

                <div className="xl:col-span-2 bg-white rounded-xl shadow-md">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800 text-white">
                        <tr><th className="p-4">Day</th><th className="p-4">Info</th><th className="p-4">Action</th></tr>
                        </thead>
                        <tbody>
                        {timetables.map(t => (
                            <tr key={t.id} className="border-b">
                                <td className="p-4 font-bold">{t.dayOfWeek}</td>
                                <td className="p-4 text-sm">{t.subject} ({t.timeSlot}) - Room {t.roomNumber} <br/><span className="text-blue-500">Prof. {t.faculty?.name}</span></td>
                                <td className="p-4"><button onClick={() => handleDelete(t.id)}><Trash2 className="text-red-500"/></button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TimetableManagement;