import React, { useState } from "react";

const StarRating = () => {
    const [rating, setRating] = useState(sessionStorage.getItem("ave"));
    const [hover, setHover] = useState(0);
    var mess= sessionStorage.getItem("rating")-1+" people:"
    mess="Average review rating from "+mess
    if(sessionStorage.getItem("rating")==1){
      mess="No one has left a review"
    }
    return (
      <div className="star-rating">
        <p class='names'>{mess}</p>
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={index <= (hover || sessionStorage.getItem("ave")) ? "on" : "off"}
            >
              <span className="star">&#9733;</span>
            </button>
          );
        })}
      </div>
    );
  };

  export default StarRating;