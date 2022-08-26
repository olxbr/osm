import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import "./SideBar.css"

export const SideBar = observer(() => {
  return (
    <nav className="osm-sidebar">
      sidebar
      <h2>Olx<br />Security<br />Manager</h2>
      <ul className="osm-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/s3-tool">S3 Tool</Link></li>
      </ul>
    </nav>
  )
});
