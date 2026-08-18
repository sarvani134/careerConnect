import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConnectionsAccepted } from "../actions/postAction";
import "../public/ConnectionPage.css";

function MyConnection() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const { acceptedConnections, loading, error } = useSelector(
    (state) => state.authReducer
  );

  // ============================================
  // GET ACCEPTED CONNECTIONS
  // ============================================

  useEffect(() => {
    dispatch(getConnectionsAccepted());
  }, [dispatch]);

  // ============================================
  // SEARCH CONNECTIONS
  // ============================================

  const filteredConnections =
    search.trim() === ""
      ? acceptedConnections
      : acceptedConnections?.filter((connection) =>
          connection.connectionId?.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
        );

  // ============================================
  // DEFAULT AI AVATAR
  // ============================================

  const getDefaultAvatar = (name) => {
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
      name || "User"
    )}`;
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return <p>Loading connections...</p>;
  }

  // ============================================
  // ERROR
  // ============================================

  if (error) {
    console.log(error);
    return <p>Unable to load connections</p>;
  }

  return (
    <section className="connection-column">

      {/* ================= HEADER ================= */}

      <div className="column-header">
        <h2>My Connections</h2>

        <span>{acceptedConnections?.length || 0}</span>
      </div>

      {/* ================= SEARCH ================= */}

      <input
        type="text"
        placeholder="Search connections..."
        className="connection-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ================= CONNECTION LIST ================= */}

      <div className="connection-list">

        {filteredConnections?.map((connection) => {
          const user = connection.userId;

          return (
            <div
              className="connection-card"
              key={connection._id}
            >

              {/* ================= AVATAR ================= */}

             <div className="connection-avatar">
                {connection.userId?.username?.profilePicture ? (
                  <img
                    src={connection.userId?.username}
                    alt={connection.userId?.username}
                  />
                ) : (
                 connection.userId?.username.charAt(0).toUpperCase()
                )}
              </div>              {/* ================= USER INFO ================= */}

              <div className="connection-info">

                <h3>
                  {user?.name || "Unknown User"}
                </h3>

                <p>
                  @{user?.username || "username"}
                </p>

                <button className="message-btn">
                  Message
                </button>

              </div>

            </div>
          );
        })}

        {/* ================= NO CONNECTIONS ================= */}

        {filteredConnections?.length === 0 && (
          <p>No connections found.</p>
        )}

      </div>

    </section>
  );
}

export default MyConnection;