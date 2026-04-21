import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

function Weddings() {
  const [weddings, setWeddings] = useState([]);
  const [form, setForm] = useState({ name: "", date: "" });
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeddings();
  }, []);

  const fetchWeddings = async () => {
    const res = await api.get("/weddings");
    setWeddings(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/weddings", form);
      toast.success("Wedding created!");
      fetchWeddings();
      setForm({ name: "", date: "" });
    } catch {
      toast.error("Failed to create wedding");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this wedding?")) return;
    await api.delete(`/weddings/${id}`);
    toast.success("Deleted!");
    fetchWeddings();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <Toaster />
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl"></span>
          <span className="font-bold text-gray-800 text-lg">
            Wedding Check-in
          </span>
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

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Weddings</h1>

        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl shadow p-6 mb-8 flex gap-4 flex-wrap"
        >
          <input
            required
            className="flex-1 min-w-48 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Wedding name (e.g. Sara & Ali)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="date"
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            + Create
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weddings.map((w) => (
            <div
              key={w._id}
              className="bg-white rounded-2xl shadow p-6 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-800">💒 {w.name}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  📅 {new Date(w.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/weddings/${w._id}`)}
                  className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-xl transition"
                >
                  Manage
                </button>
                <button
                  onClick={() => handleDelete(w._id)}
                  className="bg-red-100 hover:bg-red-200 text-red-500 text-sm px-4 py-2 rounded-xl transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {weddings.length === 0 && (
            <div className="col-span-2 text-center py-16 text-gray-400">
              <div className="text-5xl mb-3"></div>
              <p>No weddings yet. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Weddings;
