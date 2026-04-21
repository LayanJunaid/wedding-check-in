const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/guests";

export const addGuest = async (name) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const checkinGuest = async (token) => {
  const res = await fetch(`${BASE_URL}/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.json();
};

export const getGuests = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};
