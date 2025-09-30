import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../redux/slices/usersSlice";

const UserRouteRedirector = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/user/:id") {
      if (user?.id) {
        navigate(`/user/${user.id}`, { replace: true });
      } else {
        navigate("/not-found", { replace: true });
      }
    }
  }, [user, navigate]);

  return null; 
};

export default UserRouteRedirector;
