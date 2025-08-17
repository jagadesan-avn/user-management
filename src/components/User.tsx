import { useEffect, useState } from "react";
import { validateInputs } from "../utils/Validate";
import { ObjType } from "../pages/Login";
import Inputs from "./Inputs";
import { DataType } from "../pages/Users";

export type userProps = {
  data: DataType;
  handleSubmit: (value: DataType) => void;
  modalControl: React.Dispatch<React.SetStateAction<boolean>>;
  [key: string]: any;
}

const User = ({ data, handleSubmit, modalControl }: userProps) => {
  const initialState = { email: "", first_name: "", last_name: "", avatar: "" };
  const [user, setUser] = useState<DataType>(initialState);
  const [error, setError] = useState<ObjType>({});

  useEffect(() => {
    if ("id" in data) {
      (() => {
        const { first_name, last_name, email, avatar, id } = data;
        setUser({ first_name, last_name, email, avatar, id });
      })();
    } else setUser(() => initialState);
    //eslint-disable-next-line
  }, [data]);

  const handleChange = (value: string, name: string) => {
    const copy: any = structuredClone(user);
    copy[name] = value;
    setUser(() => ({ ...copy }));

    const validate = validateInputs({ name, value });
    setError((prev: any) => {
      if (!!validate[name]) return { ...prev, ...validate };
      return delete prev[name] && { ...prev };
    });
  };

  return (
    <div className="userCrud">
      <h2>{"id" in user ? "Edit User" : "Create User"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(user);
          setUser(() => initialState);
        }}
      >
        <Inputs
          type="email"
          name="email"
          label="Email"
          value={user.email}
          required={true}
          style={{ width: "100%" }}
          onChange={handleChange}
          error={error["email"]}
          placeholder={"Please enter email "}
        />
        <Inputs
          type="text"
          name="first_name"
          label="First Name"
          style={{ width: "100%" }}
          value={user.first_name}
          required={true}
          onChange={handleChange}
          error={error["first_name"]}
          placeholder={"Please enter First Name"}
        />
        <Inputs
          type="text"
          name="last_name"
          label="Last Name"
          style={{ width: "100%" }}
          value={user.last_name}
          required={true}
          onChange={handleChange}
          error={error["last_name"]}
          placeholder={"Please enter Last Name "}
        />
        <Inputs
          type="text"
          name="avatar"
          label="Profile Image Link"
          style={{ width: "100%" }}
          value={user.avatar}
          required={true}
          onChange={handleChange}
          error={error["avatar"]}
          placeholder={"Please enter Profile Image Link "}
        />
        <div style={{ display: "flex", gap: "10px", justifyContent: "end", marginTop: "10px" }}>
          <Inputs
            type={"button"}
            buttonType={"default"}
            text={"Cancel"}
            onClick={() => {
              setUser(() => initialState);
              modalControl((prev) => !prev);
            }}
          />
          <Inputs
            type={"button"}
            buttonType={"primary"}
            text={"Submit"}
            htmlType="submit"
            disabled={Object.values(error).some((val) => val) || Object.values(user).some((val) => !val)}
          />
        </div>
      </form>
    </div>
  );
};

export default User;
