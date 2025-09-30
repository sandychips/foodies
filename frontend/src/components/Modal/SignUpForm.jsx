import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/ops/usersOps";
import {
  selectUsersIsLoading,
  selectUsersError,
  clearUsersError,
} from "../../redux/slices/usersSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./Modal.module.css";
import PasswordInput from "../PasswordInput/PasswordInput.jsx";

const schema = Yup.object().shape({
  name: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const SignUpForm = ({ onClose, onSwitchToSignIn }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectUsersIsLoading);
  const error = useSelector(selectUsersError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    dispatch(clearUsersError());
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authorizationModal}>
      <h2>SIGN UP</h2>
      <div className={styles.inputWrapper}>
        <input {...register("name")} placeholder="Username*" />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}

        <input {...register("email")} placeholder="Email*" />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <PasswordInput name="password" register={register} />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "CREATE"}
      </button>

      <div className={styles.switchAuth}>
        I already have an account?{" "}
        <button type="button" onClick={onSwitchToSignIn} className={styles.linkButton}>
          Sign in
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
