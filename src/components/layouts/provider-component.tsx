'use client';
import App from '@/App';
import store from '@/store';
import { Provider } from 'react-redux';
import React, { ReactNode, Suspense } from 'react';
import Loading from '@/components/layouts/loading';
import { MantineProvider } from '@mantine/core';
import { DataCirculationProvider } from '@/components/(personal)/providers/DataCirculationProvider';

interface IProps {
    children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
    return (
        <MantineProvider>
            <Provider store={store}>
                <DataCirculationProvider>
                    <Suspense fallback={<Loading />}>
                        <App>{children}</App>
                    </Suspense>
                </DataCirculationProvider>
            </Provider>
        </MantineProvider>
    );
};

export default ProviderComponent;
