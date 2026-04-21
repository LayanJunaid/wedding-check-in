import { useEffect } from "react";
import { checkinGuest } from "../services/api";

function Scanner() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const run = async () => {
      const res = await checkinGuest(token);
      alert(res.status);
    };

    if (token) run();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold"> Checking Entry...</h1>
      </div>
    </div>
  );
}

export default Scanner;
