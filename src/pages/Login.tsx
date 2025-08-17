import { useState } from "react";
import Inputs from "../components/Inputs";
import { validateInputs } from "../utils/Validate";
import { Checkbox, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthSliceTypes, logUser } from "../redux/slices/AuthSlice";

export type ObjType = { [key: string]: string | boolean };
const Login = () => {
  const [login, setLogin] = useState<ObjType>({});
  const [error, setError] = useState<ObjType>({});
  const adminUser: AuthSliceTypes = useSelector(({ adminUser }: any) => adminUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (value: string, name: string) => {
    const copy = structuredClone(login);
    copy[name] = value;
    setLogin(() => ({ ...copy }));

    const validate = validateInputs({ name, value });
    setError((prev: any) => {
      if (!!validate[name]) return { ...prev, ...validate };
      return delete prev[name] && { ...prev };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ("isLogged" in login) {
      dispatch(logUser({ isLogged: true }));
      navigate("/users");
      notification.success({ message: "Logged in successfully", placement: "topRight", duration: 1 });
    }

    if (login["email"] === adminUser["email"] && login["password"] === adminUser["password"]) {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";
      dispatch(logUser({ token, isLogged: true, rememberUser: login?.rememberUser ?? adminUser.rememberUser }));
      navigate("/users");
      notification.success({ message: "Logged in successfully", placement: "topRight", duration: 1 });
    } else {
      switch (true) {
        case login["email"] !== adminUser["email"]:
          setError((prev) => ({ ...prev, email: "Enter valid user email" }));
          break;
        case login["password"] !== adminUser["password"]:
          setError((prev) => ({ ...prev, password: "Enter valid user password" }));
          break;
        default:
          notification.error({ message: "User email and password does'nt match", placement: "topRight" });
          break;
      }
    }
  };

  return (
    <div className={"loginContainer"}>
      <form className="loginWrapper" onSubmit={handleSubmit}>
        <Inputs
          type="email"
          name="email"
          label="Email"
          required={true}
          onChange={handleChange}
          autoComplete="email"
          prefix={<i className="fi fi-rr-user" />}
          error={error["email"]}
          placeholder={"Please enter email "}
        />
        <Inputs
          type="password"
          name="password"
          label="Password"
          required={true}
          onChange={handleChange}
          autoComplete="password"
          prefix={<i className="fi fi-rs-lock" />}
          error={error["password"]}
          placeholder={"Please enter password "}
        />
        {adminUser.rememberUser ? (
          <div className="remember">
            <div onClick={() => setLogin({ isLogged: !login.isLogged })}>
              <Checkbox checked={!!login.isLogged} />
              <p>
                Login as {adminUser?.first_name} {adminUser.last_name}
              </p>
            </div>
            <i className="fi fi-rr-trash" title="forget" onClick={() => dispatch(logUser({ rememberUser: false }))} />
          </div>
        ) : (
          <div
            className="checkRemember"
            onClick={() => setLogin((prev) => ({ ...prev, rememberUser: !login.rememberUser }))}
          >
            <Checkbox checked={!!login.rememberUser} /> Remember Me
          </div>
        )}
        <Inputs type={"button"} buttonType={"primary"} text={"Log in"} style={{ width: "100%" }} htmlType="submit" />
      </form>
    </div>
  );
};

export default Login;
