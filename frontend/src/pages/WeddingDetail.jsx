import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";

function WeddingDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [wedding, setWedding] = useState(null);
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [tab, setTab] = useState("guests");
  const inviteRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [w, g] = await Promise.all([
      api.get(`/weddings/${id}`),
      api.get(`/guests/${id}`),
    ]);
    setWedding(w.data);
    setGuests(g.data);
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/guests/add", { name, weddingId: id });
      toast.success("Guest added!");
      setGuests([...guests, res.data]);
      setName("");
    } catch {
      toast.error("Failed to add guest");
    }
  };

  const handleDelete = async (guestId) => {
    await api.delete(`/guests/${guestId}`);
    setGuests(guests.filter((g) => g._id !== guestId));
    toast.success("Guest removed");
  };

  const downloadInvite = async () => {
    const canvas = await html2canvas(inviteRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = `${selectedGuest.name}-invite.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const frontendUrl =
    import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const checkedIn = guests.filter((g) => g.used).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <Toaster />

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/weddings")}
            className="text-gray-400 hover:text-gray-600"
          >
            ←
          </button>
          <span className="text-2xl">💍</span>
          <span className="font-bold text-gray-800">{wedding?.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">👋 {user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-red-400 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-pink-500">{guests.length}</p>
            <p className="text-sm text-gray-400 mt-1">Total Guests</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-green-500">{checkedIn}</p>
            <p className="text-sm text-gray-400 mt-1">Checked In</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-gray-400">
              {guests.length - checkedIn}
            </p>
            <p className="text-sm text-gray-400 mt-1">Pending</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["guests", "dashboard"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl font-medium transition capitalize ${
                tab === t
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-500 hover:bg-pink-50"
              }`}
            >
              {t === "guests" ? "👥 Guests" : "📊 Dashboard"}
            </button>
          ))}
        </div>

        {tab === "guests" && (
          <>
            {/* Add Guest */}
            <form
              onSubmit={handleAddGuest}
              className="bg-white rounded-2xl shadow p-6 mb-6 flex gap-4"
            >
              <input
                required
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Guest name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                + Add
              </button>
            </form>

            {/* Guest List */}
            <div className="space-y-3">
              {guests.map((g) => (
                <div
                  key={g._id}
                  className="bg-white rounded-2xl shadow p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{g.name}</p>
                    <p className="text-xs mt-1">
                      {g.used ? (
                        <span className="text-green-500">
                          ✅ Checked in —{" "}
                          {new Date(g.checkinTime).toLocaleTimeString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">⏳ Not checked in</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedGuest(g)}
                      className="bg-pink-100 hover:bg-pink-200 text-pink-600 text-sm px-4 py-2 rounded-xl transition"
                    >
                      🎫 Invite
                    </button>
                    <button
                      onClick={() => handleDelete(g._id)}
                      className="bg-red-100 hover:bg-red-200 text-red-400 text-sm px-4 py-2 rounded-xl transition"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
              {guests.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">👥</div>
                  <p>No guests yet. Add your first guest!</p>
                </div>
              )}
            </div>
          </>
        )}

        {tab === "dashboard" && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-pink-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                      Check-in Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g, i) => (
                    <tr
                      key={g._id}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {g.name}
                      </td>
                      <td className="px-6 py-4">
                        {g.used ? (
                          <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
                            ✅ Checked In
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">
                            ⏳ Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {g.checkinTime
                          ? new Date(g.checkinTime).toLocaleTimeString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold text-center mb-4">
              Guest Invitation
            </h2>

            {/* Invite Card */}
            <div
              ref={inviteRef}
              className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl p-6 text-white text-center mb-6"
              style={{ fontFamily: "serif" }}
            >
              <div className="text-4xl mb-2">💍</div>
              <h3 className="text-xl font-bold mb-1">{wedding?.name}</h3>
              <p className="text-pink-100 text-sm mb-4">
                📅{" "}
                {wedding &&
                  new Date(wedding.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
              <div className="bg-white rounded-xl p-3 inline-block mb-3">
                <QRCode
                  value={`${frontendUrl}/scanner?token=${selectedGuest.token}`}
                  size={140}
                />
              </div>
              <p className="text-lg font-semibold">{selectedGuest.name}</p>
              <p className="text-pink-100 text-xs mt-1">
                Scan for entry • One time use
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadInvite}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition"
              >
                ⬇️ Download
              </button>
              <button
                onClick={() => setSelectedGuest(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeddingDetail;
