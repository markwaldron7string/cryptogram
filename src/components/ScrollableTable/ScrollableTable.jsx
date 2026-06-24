import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "../Icons/Icons";
import "./ScrollableTable.css";

const ScrollableTable = ({ children }) => {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateArrows, children]);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * scrollRef.current.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  return (
    <div className="scrollable-table">
      <button
        type="button"
        className={`scroll-arrow scroll-arrow-left ${canLeft ? "visible" : ""}`}
        onClick={() => scroll(-1)}
        aria-label="Scroll table left"
        tabIndex={canLeft ? 0 : -1}
      >
        <ChevronLeft />
      </button>

      <div
        className="scrollable-table-viewport"
        ref={scrollRef}
        onScroll={updateArrows}
      >
        <div className="scrollable-table-inner">{children}</div>
      </div>

      <button
        type="button"
        className={`scroll-arrow scroll-arrow-right ${canRight ? "visible" : ""}`}
        onClick={() => scroll(1)}
        aria-label="Scroll table right"
        tabIndex={canRight ? 0 : -1}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default ScrollableTable;
