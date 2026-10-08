import{ instance } from '../../shared/api/axiosInstance';
export const registerUser = async (username, password, email) => {
    const response = await instance.post('api/auth/register', { 
        username,
        password,
        email
    }); 

    return { data: response.data.token, error: null };
};