import React from "react";
import { useWatchlist } from "../../context/WatchlistContext";
import "./StarButton.css";

const StarButton = ({ coinId, coinName }) => {
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const starred = isWatchlisted(coinId);

  return (
    <button
      className={`star-btn ${starred ? "starred" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(coinId);
      }}
      aria-label={starred ? `Remove ${coinName} from watchlist` : `Add ${coinName} to watchlist`}
      title={starred ? "Remove from watchlist" : "Add to watchlist"}
    >
      {starred ? "★" : "☆"}
    </button>
  );
};

export default StarButton;
