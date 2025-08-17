import { Pagination, Radio, Table, TableColumnsType } from "antd";
import React, { useState } from "react";
import { DataType } from "../pages/Users";

type TabType = "card" | "table";

type ListPropsType = {
  data: DataType[];
  modalControl: React.Dispatch<React.SetStateAction<boolean>>;
  columns: TableColumnsType<DataType>;
  modifyUser: React.Dispatch<React.SetStateAction<DataType>>;
  deleteUser: (value: number) => void;
  pageChange: (value: number) => void;
  page?: number;
  count: number;
  pageLimit?: number;
  isLoading?: boolean;
};

const CustomList = ({
  data,
  columns,
  modifyUser,
  modalControl,
  deleteUser,
  page,
  count,
  pageChange,
  pageLimit = 6,
  isLoading,
}: ListPropsType) => {
  const [mode, setMode] = useState<TabType>("table");

  return (
    <div>
      <Radio.Group
        className="tabContainer"
        onChange={(e) => setMode(e.target.value)}
        value={mode}
        style={{ marginBottom: 8 }}
      >
        <Radio.Button className="tab-btn" value="table">
          <i className="fi fi-rr-table" style={{ display: "flex" }} /> Table
        </Radio.Button>
        <Radio.Button className="tab-btn" value="card">
          <i className="fi fi-rr-list" style={{ display: "flex" }} /> Cards
        </Radio.Button>
      </Radio.Group>
      {mode === "table" ? (
        <Table
          dataSource={data.map((i: any, index: number) => ({ ...i, key: index }))}
          columns={columns}
          loading={isLoading}
          pagination={false}
        />
      ) : (
        <div className="CardContainer">
          {data?.length &&
            data.map((i: any, index: number) => {
              return (
                <div className="card" key={index}>
                  <img
                    src={i?.avatar ?? "https://avatar.iran.liara.run/public/5"}
                    alt="profile"
                    height={50}
                    loading="lazy"
                    width={50}
                    style={{ objectFit: "contain", borderRadius: "50px" }}
                  />
                  <p style={{ display: "flex" }}>
                    {i?.first_name ?? "user"}&nbsp;{i?.last_name ?? ""}
                  </p>
                  <p>{i?.email ?? ""}</p>
                  <div className="cardActions">
                    <i
                      className="fi fi-rr-pencil"
                      onClick={() => {
                        modalControl((prev) => !prev);
                        modifyUser({ ...i });
                      }}
                    />
                    <i className="fi fi-rr-trash" onClick={() => deleteUser(i.id)} />
                  </div>
                </div>
              );
            })}
        </div>
      )}
      {pageLimit <= count && (
        <Pagination
          style={{ float: "right", marginTop: "4svh" }}
          current={page}
          total={count}
          pageSize={pageLimit}
          onChange={pageChange}
        />
      )}
    </div>
  );
};

export default CustomList;
