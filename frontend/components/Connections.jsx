import { useEffect, useState } from "react";
import axios from "axios";
import "../public/Connections.css";

function Connections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your connections.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/users/getConnectionsReceived/${token}`
        );
        setConnections(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.msg || "Unable to load connections.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  return (
    <div className="connections-page">
      <h1>Connections</h1>
      <p className="connections-description">People who want to connect with you.</p>

      {loading && <p>Loading connections...</p>}
      {error && <p className="connections-message">{error}</p>}
      {!loading && !error && connections.length === 0 && (
        <p className="connections-message">You have no connection requests.</p>
      )}

      <div className="connection-list">
        {connections.map((connection) => (
          <ConnectionCard key={connection._id} user={connection.userId} status="Request received" />
        ))}
      </div>
    </div>
  );
}

export function ConnectionCard({ user, status }) {
  const name = user?.name || user?.username || "BusinessConnect member";
  const avatar = user?.profilePicture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

  return (
    <article className="connection-card">
      <img className="connection-avatar" src={avatar} alt={name} />
      <div>
        <h2>{name}</h2>
        {user?.username && <p>@{user.username}</p>}
        {user?.email && <p>{user.email}</p>}
        <span>{status}</span>
      </div>
    </article>
  );
}

export default Connections;
