import React from "react";
import ContentLoader from "react-content-loader";

interface AsideCategoryProps {
  speed?: number;
  width?: number;
  height?: number;
  viewBox?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

const AsideCategoryLoader: React.FC<AsideCategoryProps> = (props) => (
  <ContentLoader
    speed={2}
    width={263}
    height={24}
    viewBox="0 0 263 24"
    backgroundColor="#f3f3f3"
    foregroundColor="#cbc8c8"
    {...props}
  >
    <circle cx="12" cy="11" r="11" />
    <rect x="33" y="1" rx="5" ry="5" width="216" height="20" />
  </ContentLoader>
);

export default AsideCategoryLoader;
