import QRCode from "qrcode.react";

function QRGenerator({ token }) {
  const url = `${import.meta.env.VITE_FRONTEND_URL}/scanner?token=${token}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="font-semibold">Your Guest QR</h3>

      <div className="p-4 bg-white rounded-xl shadow">
        <QRCode value={url} size={160} />
      </div>

      <p className="text-xs text-gray-500">Scan for entry</p>
    </div>
  );
}

export default QRGenerator;
