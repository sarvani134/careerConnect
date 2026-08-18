import React from "react";
import MyConnection from "./MyConnection";
import ConnectionRecieved from "./ConnectionRecieved";
import ConnectionSent from "./ConnectionSent";
import "../public/ConnectionPage.css";

function ConnectionPage() {
  return (
    <div className="connection-page">

      <MyConnection />

      <ConnectionRecieved />

      <ConnectionSent />

    </div>
  );
}

export default ConnectionPage;