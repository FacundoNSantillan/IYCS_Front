import { instance } from '../../shared/api/axiosInstance';

export const loginUser = async (username, password) => {
  const payload = { 
    Username: username, 
    Password: password 
  };

  const response = await instance.post('api/auth/login', payload);
  return { data: response.data.token, error: null };
};