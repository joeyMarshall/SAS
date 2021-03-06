import React from "react";
import { Link } from "react-router-dom";
import "./ReportSubmitted.css";
import Button from "@material-ui/core/Button";

function ReportSubmitted() {
  return (
    <div className="reportSubmitted">
      <h1>Story Shared</h1>
      <div className="reportSubmitted__details">
        {/* checkmark */}
        <svg
          class="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            class="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            class="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>

        <h2>Thank you for sharing.</h2>
        <h3>
          This will help create awareness to the people living in the location
          where the incident occurred.
        </h3>
        <Button
          classes={{ label: "reportSubmitted__button" }}
          component={Link}
          to="/"
        >
          Go To Homepage
        </Button>
      </div>
    </div>
  );
}

export default ReportSubmitted;
