import { useEffect, useState } from "react";
import socket from "../socket/socket";

function Dashboard() {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    socket.on("guest_checked_in", (name) => {
      setGuests((prev) => [...prev, name]);
    });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Live Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold">Total Check-ins</h2>
          <p className="text-3xl text-pink-500">{guests.length}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Live Guests</h2>

        <div className="space-y-2">
          {guests.map((g, i) => (
            <div key={i} className="bg-white p-3 rounded-lg shadow">
              {g}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
