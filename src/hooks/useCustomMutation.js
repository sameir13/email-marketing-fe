import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCustomMutation = (mutationFn, options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: async (data, variables, context) => {
            console.log('Mutation success:', data);
            console.log('Invalidating keys:', options.invalidateKeys);

            // Invalidate queries
            if (options.invalidateKeys && Array.isArray(options.invalidateKeys)) {
                const invalidatePromises = options.invalidateKeys.map((key) => {
                    console.log('Invalidating query key:', key);
                    return queryClient.invalidateQueries({
                        queryKey: key,
                        refetchType: 'active', // Refetch active queries immediately
                    });
                });

                await Promise.all(invalidatePromises);
                console.log('All queries invalidated');
            }

            // Explicitly refetch queries
            if (options.refetchKeys && Array.isArray(options.refetchKeys)) {
                const refetchPromises = options.refetchKeys.map((key) => {
                    console.log('Refetching query key:', key);
                    return queryClient.refetchQueries({ queryKey: key });
                });

                await Promise.all(refetchPromises);
                console.log('All queries refetched');
            }

            // Call custom onSuccess
            if (options.onSuccess) {
                options.onSuccess(data, variables, context);
            }
        },
        onError: (error, variables, context) => {
            console.error('Mutation error:', error);

            if (options.onError) {
                options.onError(error, variables, context);
            }
        },
        ...options,
    });
};
