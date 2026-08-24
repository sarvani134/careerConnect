import { useEffect, useState } from "react";
import { clientServer } from "../src/config";
import { ConnectionCard } from "./Connections";
import "../public/Connections.css";

function ConnectionsSent() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSentConnections = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view sent requests.");
        setLoading(false);
        return;
      }

      try {
        const response = await clientServer.get(
          "/users/getConnectionsSent",
          { params: { token } }
        );
        setConnections(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.msg || "Unable to load sent requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentConnections();
  }, []);

  return (
    <div className="connections-page">
      <h1>Connections Sent</h1>
      <p className="connections-description">Connection requests you have sent.</p>

      {loading && <p>Loading sent requests...</p>}
      {error && <p className="connections-message">{error}</p>}
      {!loading && !error && connections.length === 0 && (
        <p className="connections-message">You have not sent any connection requests.</p>
      )}

      <div className="connection-list">
        {connections.map((connection) => (
          <ConnectionCard
            key={connection._id}
            user={connection.connectionId}
            status={connection.status_accepted ? "Connected" : "Request sent"}
          />
        ))}
      </div>
    </div>
  );
}

export default ConnectionsSent;
