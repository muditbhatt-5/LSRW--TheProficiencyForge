import axios from 'axios';

const API_BASE_URL = 'https://localhost:7106/api';

// User API calls
export const getUsers = () => axios.get(`${API_BASE_URL}/User`);
export const getUser = (id) => axios.get(`${API_BASE_URL}/User/${id}`);
export const createUser = (user) => axios.post(`${API_BASE_URL}/User`, user);
export const updateUser = (id, user) => axios.put(`${API_BASE_URL}/User/${id}`, user);
export const deleteUser = (id) => axios.delete(`${API_BASE_URL}/User/${id}`);

// Paragraph Reader API calls
export const getParagraphReaders = () => axios.get(`${API_BASE_URL}/Paragraph_Reader`);
export const getParagraphReader = (id) => axios.get(`${API_BASE_URL}/Paragraph_Reader/${id}`);
export const createParagraphReader = (reader) => axios.post(`${API_BASE_URL}/Paragraph_Reader`, reader);
export const updateParagraphReader = (id, reader) => axios.put(`${API_BASE_URL}/Paragraph_Reader/${id}`, reader);
export const deleteParagraphReader = (id) => axios.delete(`${API_BASE_URL}/Paragraph_Reader/${id}`);

// Paragraph Listener API calls
export const getParagraphListeners = () => axios.get(`${API_BASE_URL}/Paragraph_Listener`);
export const getParagraphListener = (id) => axios.get(`${API_BASE_URL}/Paragraph_Listener/${id}`);
export const createParagraphListener = (listener) => axios.post(`${API_BASE_URL}/Paragraph_Listener`, listener);
export const updateParagraphListener = (id, listener) => axios.put(`${API_BASE_URL}/Paragraph_Listener/${id}`, listener);
export const deleteParagraphListener = (id) => axios.delete(`${API_BASE_URL}/Paragraph_Listener/${id}`);

// MCQ API calls
export const getMcqs = () => axios.get(`${API_BASE_URL}/Mcqs`);
export const getMcq = (id) => axios.get(`${API_BASE_URL}/Mcqs/${id}`);
export const createMcq = (mcq) => axios.post(`${API_BASE_URL}/Mcqs`, mcq);
export const updateMcq = (id, mcq) => axios.put(`${API_BASE_URL}/Mcqs/${id}`, mcq);
export const deleteMcq = (id) => axios.delete(`${API_BASE_URL}/Mcqs/${id}`);
