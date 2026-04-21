function GuestList({ guests }) {
  return (
    <div>
      {guests.map((g) => (
        <div key={g._id}>
          {g.name} - {g.used ? "Used " : "Active"}
        </div>
      ))}
    </div>
  );
}

export default GuestList;
