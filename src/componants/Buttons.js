import * as React from "react";

export default function Buttons(props) {
  return (
      <div className="row">
        <div className="col-md-12 text-center" style={{ marginTop: "30px" }}>
              <button
                  className="btn btn-dark"
                  style={{ margin: "10px" }}
                  onClick={props.logout}
              >
                Logout
              </button>
        </div>
      </div>
  );
}
