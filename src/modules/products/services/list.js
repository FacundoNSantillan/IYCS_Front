import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async ({search = null, isActive = null, pageNumber = 1, pageSize = 10,} = {}) => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber);
  params.append('pageSize', pageSize);

  if (search) params.append('search', search);

  if (isActive !== null && isActive !== undefined && isActive !== '') {
    params.append('isActive', isActive);
  }

  console.log("📡 URL:", `api/products?${params.toString()}`);

  const url = `api/products?${params.toString()}`;

  try {
    const response = await instance.get(url);
    return { data: response.data, error: null };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { data: { totalCount: 0, items: [] }, error: null };
    }
    throw error;
  }
};