import { useQuery } from '@tanstack/react-query';

export const useApiQuery = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options
  });
};
