const MainTitle = ({ children, className = "", ...props }) => (
  <h1 className={className} {...props}>
    {children}
  </h1>
);

export default MainTitle;
