const StarRating = ({ rating, setRating }) => {
    const getColor = (ratingValue) => {
        if (ratingValue >= 8) {
            return "#90EE90"; // Light Green
        } else if (ratingValue >= 4) {
            return "#F0E68C"; // Khaki
        } else {
            return "#FA8072"; // Salmon
        }
    };

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
                const backgroundColor = rating >= ratingValue ? getColor(ratingValue) : "white";

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
                            backgroundColor,
                            borderStyle: "solid",
                            borderColor: getColor(ratingValue),
                            color: "black",
                            fontWeight: "bold"
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
