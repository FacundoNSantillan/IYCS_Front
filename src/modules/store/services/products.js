import { instance } from '../../shared/api/axiosInstance';

export const getPublicProducts = async ({
  search = null,
  pageNumber = 1,
  pageSize = 12,
} = {}) => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber);
  params.append('pageSize', pageSize);
  params.append('isActive', 'true');
  params.append('hasStock', 'true');

  if (search) params.append('search', search);

  const url = `/api/products?${params.toString()}`;

  try {
    const response = await instance.get(url);
    return { data: response.data, error: null };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { data: { totalCount: 0, items: [] }, error: null };
    }
    throw error;
  }
};

export const getProductById = async (id) => {
const response = await instance.get(`/api/products/${id}`);
return response.data;
};