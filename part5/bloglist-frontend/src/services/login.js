import axios from "axios";
const baseUrl = "/api/login";

const login = async (creds) => {
  const response = await axios.post(baseUrl, creds);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { login };
