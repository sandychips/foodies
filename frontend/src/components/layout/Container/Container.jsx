import styles from './Container.module.css';

const Container = ({ children, className = '', ...props }) => {
  const containerClasses = [
    styles.container,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;