import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { useSelector } from "react-redux";

type Props = {
  children: ReactNode;
};
const Authenticate = ({ children }: Props) => {
  const navigate = useNavigate();
  const { isLogged } = useSelector(({ adminUser }: any) => adminUser);

  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    } else {
      navigate("/users");
    }
    //eslint-disable-next-line
  }, [isLogged]);

  if (!isLogged) {
    return null;
  }

  return children;
};

export default Authenticate;
