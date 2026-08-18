import React, { useEffect } from "react";
import "../public/ConnectionPage.css";
import { useDispatch, useSelector } from "react-redux";
import {
 
  acceptConnectionRequest,
  getConnectionsAccepted,
  getConnectionsReceived
} from "../actions/postAction";

function ConnectionRecieved() {

  const dispatch = useDispatch();

  const { connections, loading, error } = useSelector(
    (state) => state.authReducer
  );
  useEffect(() => {
    dispatch(getConnectionsReceived());
    
  }, [dispatch]);


  const handleAccept = async (requestId) => {
    let token=localStorage.getItem("token")

    await dispatch(
      acceptConnectionRequest({
        token,
        requestId,
        status: "accept"
      })
    );
    


    // reload received requests
    await dispatch(getConnectionsReceived());
    await dispatch(getConnectionsAccepted())
  };


  const handleIgnore = async (requestId) => {
    const token = localStorage.getItem("token");

    await dispatch(
      acceptConnectionRequest({
        token,
        requestId,
        status: "ignore"
      })
    );

    dispatch(getConnectionsReceived());
  };


  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p>Unable to load requests</p>;
  }


  return (
    <section className="connection-column">

      <div className="column-header">
        <h2>Requests Received</h2>

        <span>{connections?.length || 0}</span>
      

      </div>


      <div className="connection-list">
         {(!connections || connections.length === 0) && (
  <h3>No Requests Received</h3>
)}

        {connections?.map((connection) => (

          <div
            className="connection-card"
            key={connection._id}
          >

            <div className="connection-avatar">

              {connection.userId?.profilePicture ? (

                <div className="connection-avatar">
                {connection.userId?.username?.profilePicture ? (
                  <img
                    src={connection.userId?.username}
                    alt={connection.userId?.username}
                  />
                ) : (
                 connection.userId?.username.charAt(0).toUpperCase()
                )}
              </div>

              ) : (

                connection.userId?.name?.charAt(0).toUpperCase()

              )}

            </div>


            <div className="connection-info">

              <h3>
                {connection.userId?.name}
              </h3>

              <p>
                @{connection.userId?.username}
              </p>


              <div className="request-actions">

                <button
                  className="accept-btn"
                  onClick={() =>
                    handleAccept(connection._id)
                  }
                >
                  Accept
                </button>


                <button
                  className="ignore-btn"
                  onClick={() =>
                    handleIgnore(connection._id)
                  }
                >
                  Ignore
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default ConnectionRecieved;
