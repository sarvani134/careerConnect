import React, { useEffect } from "react";
import "../public/ConnectionPage.css";
import { useDispatch, useSelector } from "react-redux";
import { getConnectionsSent } from "../actions/postAction";

function ConnectionSent() {

  const dispatch = useDispatch();

  const { sentConnections, loading, error } = useSelector(
    (state) => state.authReducer
  );

  useEffect(() => {

    const token = localStorage.getItem("token");

    dispatch(
      getConnectionsSent({
        token
      })
    );

  }, [dispatch]);


  const handleWithdraw = async (requestId) => {

    const token = localStorage.getItem("token");

    await dispatch(
      getConnectionsSent({
        token,
        status: "withdraw",
        requestId
      })
    );
  };


  if (loading) {
    return <p>Loading sent requests...</p>;
  }

  if (error) {
    return <p>Unable to load sent requests</p>;
  }


  return (
    <section className="connection-column">

      <div className="column-header">

        <h2>Requests Sent</h2>

        <span>
          {sentConnections?.length || 0}
        </span>

      </div>


      <div className="connection-list">

        {(sentConnections?.length || 0) === 0 && (
          <h3>No Requests Sent</h3>
        )}


        {sentConnections?.map((connection) => (

          <div
            className="connection-card"
            key={connection._id}
          >

           <div className="connection-avatar">
                {connection.connectionId?.username?.profilePicture ? (
                  <img
                    src={connection.connectionId?.username}
                    alt={connection.connectionId?.username}
                  />
                ) : (
                 connection.connectionId?.username.charAt(0).toUpperCase()
                )}
              </div>   


            <div className="connection-info">

              <h3>
                {connection.connectionId?.name}
              </h3>

              <p>
                @{connection.connectionId?.username}
              </p>

              <button
                className="withdraw-btn"
                onClick={() =>
                  handleWithdraw(connection._id)
                }
              >
                Withdraw
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default ConnectionSent;