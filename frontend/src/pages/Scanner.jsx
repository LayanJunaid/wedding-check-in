import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Scanner() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      // قراءة QR من الصورة
      const { BrowserQRCodeReader } = await import("@zxing/browser");
      const reader = new BrowserQRCodeReader();
      const imgUrl = URL.createObjectURL(file);
      const decoded = await reader.decodeFromImageUrl(imgUrl);
      const url = new URL(decoded.getText());
      const token = url.searchParams.get("token");

      const res = await api.post("/guests/checkin", { token });
      setResult(res.data);
    } catch {
      setResult({ status: "invalid_token" });
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "✅",
      text: "Welcome!",
      color: "text-green-600",
    },
    already_used: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "⚠️",
      text: "Already checked in!",
      color: "text-yellow-600",
    },
    invalid: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "❌",
      text: "Invalid ticket",
      color: "text-red-600",
    },
    invalid_token: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "❌",
      text: "Invalid QR code",
      color: "text-red-600",
    },
  };

  const config = result ? statusConfig[result.status] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl"></span>
          <span className="font-bold text-gray-800">Security Scanner</span>
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-600"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Scan QR Code
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Upload or take a photo of the guest's QR code
          </p>

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 hover:border-pink-500 hover:bg-pink-50 transition">
              <div className="text-4xl mb-2"></div>
              <p className="text-pink-500 font-medium">Tap to scan QR</p>
              <p className="text-gray-400 text-xs mt-1">Camera or gallery</p>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleScan}
            />
          </label>

          {loading && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-500">Checking...</span>
            </div>
          )}

          {result && config && (
            <div
              className={`mt-6 ${config.bg} border ${config.border} rounded-2xl p-6`}
            >
              <div className="text-4xl mb-2">{config.icon}</div>
              <p className={`text-xl font-bold ${config.color}`}>
                {config.text}
              </p>
              {result.name && (
                <p className="text-gray-600 mt-1 font-medium">{result.name}</p>
              )}
              <button
                onClick={() => setResult(null)}
                className="mt-4 bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-xl hover:bg-gray-50 transition text-sm"
              >
                Scan Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Scanner;
