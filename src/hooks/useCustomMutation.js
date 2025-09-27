import { useMutation } from '@tanstack/react-query';

export const useCustomMutation = (mutationFn, options = {}) => {
  return useMutation({
    mutationFn,
    ...options
  });
};
