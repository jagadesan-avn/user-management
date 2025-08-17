import { apiMethods } from "./api.methods";

type GetUsersParams = { params: Record<string, any>; headers: any };
const ServerApis = () => {
  const users = {
    getUsers: async ({ params, headers }: GetUsersParams) =>
      await apiMethods.get("https://reqres.in/api/users", params, headers),
  };

  return {
    ...users,
  };
};

export default ServerApis;
