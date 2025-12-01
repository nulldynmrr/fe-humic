import request from "./request";

export const loginAdmin = async (username, password) => {
  const response = await request.post("/admin/login", { username, password });
  return response.data;
};
