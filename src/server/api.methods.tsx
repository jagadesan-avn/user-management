import axios, { AxiosRequestHeaders } from "axios";

export const apiMethods = {
  get: async (url: string, params?: Record<string, any>, headers?: AxiosRequestHeaders) => {
    try {
      const response = await axios.get(url, {
        params,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(`Error fetching data from ${url}`, error);
    }
  },
};
