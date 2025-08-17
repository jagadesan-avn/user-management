import { Modal, TableColumnsType } from "antd";
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import Inputs from "../components/Inputs";
import CustomList from "../components/CustomList";
import User from "../components/User";
import { useDispatch, useSelector } from "react-redux";
import { addUser, fetchUsers, searchUser, updateUser } from "../redux/slices/UsersSlice";
import type { AppDispatch } from "../redux/slices/UsersSlice";
const { confirm } = Modal;

export type DataType = {
  key?: React.Key;
  id?: string;
  avatar?: string;
  email: string;
  first_name: string;
  last_name: string;
  action?: string;
  index?: number;
};

const Users = () => {
  const initialState = { email: "", first_name: "", last_name: "", avatar: "" };
  const [user, setUser] = useState<DataType>(initialState);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const response = useSelector((state: any) => state.usersList);
  const dispatch = useDispatch<AppDispatch>();
  const query = useDeferredValue(search);
  console.log(response);

  useEffect(() => {
    if (query.length) {
      const preventRerenders = setTimeout(() => {
        if (query.length) {
          dispatch(searchUser({ query, page }));
        }
      }, 1000);
      return () => clearTimeout(preventRerenders);
    }
    fetchUsersData();
    //eslint-disable-next-line
  }, [page, query]);

  const fetchUsersData = useCallback(() => {
    if (!response.visitedPages?.includes(page)) {
      const params = {
        page,
        per_page: response.per_page,
        total: response.total,
        searh_count: response.data.length,
        visitedPage: response.visitedPage,
      };
      dispatch(fetchUsers(params));
    }
    //eslint-disable-next-line
  }, [page, query]);

  const columns: TableColumnsType<DataType> = [
    {
      title: "",
      dataIndex: "avatar",
      key: "profile",
      width: "20%",
      render: (value) => (
        <div style={{ textAlign: "center" }}>
          <img
            src={value ?? "https://avatar.iran.liara.run/public/5"}
            alt="profile"
            height={50}
            width={50}
            style={{ objectFit: "contain", borderRadius: "50px" }}
          />
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      render: (value) => <p style={{ color: "#319bff" }}>{value}</p>,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: "20%",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: "20%",
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "actions",
      width: "20%",
      render: (val, _, index) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Inputs
            type={"button"}
            buttonType={"primary"}
            text={"Edit"}
            onClick={() => {
              const modifyUser = response.data.find(({ id }: Record<string, any>) => id === val);
              setUser(modifyUser);
              setShowModal(!showModal);
            }}
          />
          <Inputs type={"button"} buttonType={"danger"} text={"Delete"} onClick={() => handleDelete(val)} />
        </div>
      ),
    },
  ];

  const handleSubmit = (value: DataType) => {
    setUser(initialState);
    "id" in value ? dispatch(updateUser(value)) : dispatch(addUser(value));
    fetchUsersData();
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      onOk: () => {
        dispatch({ type: "users/deleteUser", payload: { id } });
        fetchUsersData();
      },
      onCancel: () => {
        console.log("Delete cancelled");
      },
    });
  };

  return (
    <section className="users">
      <div>
        <div>
          <b>Users</b>
          <div className="userIntractions">
            <Inputs
              type={"text"}
              value={query}
              suffix={<i className="fi fi-rr-search" />}
              placeholder="input search text"
              style={{ padding: 0 }}
              onChange={setSearch}
            />
            <Inputs
              type={"button"}
              buttonType={"primary"}
              text={"Create user"}
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        <CustomList
          data={response.currentUsers}
          page={page}
          isLoading={response.status === "loading"}
          pageLimit={response.per_page}
          count={response.search_count !== null ? response.search_count : response.total}
          modifyUser={setUser}
          columns={columns}
          modalControl={() => setShowModal((prev) => !prev)}
          deleteUser={(id) => handleDelete(id)}
          pageChange={setPage}
        />
        <Modal
          open={showModal}
          okText="Submit"
          footer={false}
          onCancel={() => {
            setShowModal(false);
            setUser(initialState);
          }}
        >
          <User data={user} modalControl={setShowModal} handleSubmit={handleSubmit} />
        </Modal>
      </div>
    </section>
  );
};

export default Users;
