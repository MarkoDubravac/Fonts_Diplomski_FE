import React from "react";

const StarRating = ({ rating, setRating }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {[...Array(10)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <div
            className="mb-3"
            key={index}
            onClick={() => setRating(ratingValue)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 5px",
              cursor: "pointer",
              backgroundColor: rating >= ratingValue ? "blue" : "white",
              borderStyle: "solid",
              borderColor: "blue",
              color: rating >= ratingValue ? "white" : "black",
            }}
          >
            {ratingValue}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
