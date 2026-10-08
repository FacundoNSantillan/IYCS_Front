import { instance } from '../../shared/api/axiosInstance';

export const getOrders = async ({ search = null, status = null, customer = null, pageNumber = 1, pageSize = 10 }) => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber);
  params.append('pageSize', pageSize);
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (customer) params.append('customer', customer);

  try {
    const response = await instance.get(`/api/orders?${params.toString()}`);
    return { data: response.data, error: null };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { data: { totalCount: 0, items: [] }, error: null };
    }
    throw error;
}
};