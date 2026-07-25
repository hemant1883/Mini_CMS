// frontend/src/components/SeatingGrid.js
export default function SeatingGrid({ studentSeat }) {
    // studentSeat = { bench: 3, seat: 2 }
    const rows = [1, 2, 3, 4]; // Benches
    const cols = [1, 2, 3, 4]; // Seats per bench

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <div className="h-10 bg-black text-white text-center mb-8">Teacher Table</div>
            <div className="grid grid-cols-4 gap-4">
                {rows.map(r => cols.map(c => (
                    <div key={`${r}${c}`}
                         className={`w-12 h-12 border flex items-center justify-center 
                         ${studentSeat.bench === r && studentSeat.seat === c ? 'bg-green-500 text-white' : 'bg-white'}`}>
                        {r}{c}
                    </div>
                )))}
            </div>
        </div>
    );
}