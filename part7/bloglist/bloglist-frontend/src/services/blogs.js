import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createOne = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, blog, config);
  return response.data;
};

const incrementLike = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config);
  return response.data;
};

const removeOne = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response;
};

const createComment = async ({ id, content }) => {
  const config = {
    headers: { Authorization: token },
  };

  const requestBody = {
    content,
  };

  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    requestBody,
    config
  );

  return response.data;
};

export default {
  getAll,
  createOne,
  incrementLike,
  removeOne,
  createComment,
  setToken,
};
