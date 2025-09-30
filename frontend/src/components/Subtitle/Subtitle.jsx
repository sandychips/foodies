import React from "react";

const Subtitle = ({ children, className = "", ...props }) => (
  <h2 className={className} {...props}>
    {children}
  </h2>
);

export default Subtitle;
