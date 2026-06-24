import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./TableSkeleton.css";

const TableSkeleton = ({ rows = 10 }) => (
  <div className="table-skeleton">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton-row">
        <Skeleton width={24} height={16} baseColor="#1a1a2e" highlightColor="#2a2a3e" />
        <div className="skeleton-coin">
          <Skeleton circle width={32} height={32} baseColor="#1a1a2e" highlightColor="#2a2a3e" />
          <Skeleton width={100} height={16} baseColor="#1a1a2e" highlightColor="#2a2a3e" />
        </div>
        <Skeleton width={80} height={16} baseColor="#1a1a2e" highlightColor="#2a2a3e" />
        <Skeleton width={60} height={24} borderRadius={6} baseColor="#1a1a2e" highlightColor="#2a2a3e" />
        <Skeleton width={120} height={40} baseColor="#1a1a2e" highlightColor="#2a2a3e" />
        <Skeleton width={90} height={16} baseColor="#1a1a2e" highlightColor="#2a2a3e" />
      </div>
    ))}
  </div>
);

export default TableSkeleton;
