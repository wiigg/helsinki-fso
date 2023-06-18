import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export const createAnecdote = async (content) => {
  const newAnecdote = { content, votes: 0 };
  const response = await axios.post(baseUrl, newAnecdote);
  return response.data;
};

export const updateAnecdote = async (anecdote) => {
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, anecdote);
  return response.data;
};
