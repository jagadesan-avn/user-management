import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/AuthSlice";
import { notification } from "antd";

const Layout = () => {
  const { first_name, last_name } = useSelector(({ adminUser }: any) => adminUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <header>
        <p>{first_name} {last_name}</p>
        <i
          className="logout-btn fi fi-bs-arrow-left-from-arc"
          onClick={() => {
            dispatch(logout());
            notification.success({ message: "Logged out successfully", placement: "topRight", duration: 1 });
            setTimeout(() => navigate("/login"), 1000);
          }}
        />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
