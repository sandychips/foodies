import css from "./ErrorMassage.module.css";

const ErrorMassage = () => (
  <p className={css.error}>
    Whoops, something went wrong! Please try reloading this page!
  </p>
);

export default ErrorMassage;
