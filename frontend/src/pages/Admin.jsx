import { useState } from "react";
import { addGuest } from "../services/api";
import QRGenerator from "../components/QRGenerator";

function Admin() {
  const [name, setName] = useState("");
  const [guest, setGuest] = useState(null);

  const handleAdd = async () => {
    const data = await addGuest(name);
    setGuest(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Wedding Admin</h1>

        <input
          className="w-full p-2 border rounded-lg mb-4"
          placeholder="Guest name"
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="w-full bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600"
        >
          Add Guest
        </button>

        {guest && (
          <div className="mt-6 text-center">
            <QRGenerator token={guest.token} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
