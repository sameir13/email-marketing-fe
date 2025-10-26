'use client';
import App from '@/App';
import store from '@/store';
import { Provider } from 'react-redux';
import React, { ReactNode, Suspense } from 'react';
import Loading from '@/components/layouts/loading';
import { MantineProvider, createTheme } from '@mantine/core';
import { DataCirculationProvider } from '@/components/(personal)/providers/DataCirculationProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IProps {
    children?: ReactNode;
}

const theme = createTheme({
    primaryColor: 'blue',
    components: {
        Button: {
            classNames: {
                root: 'font-semibold !important',
            },
        },
        TextInput: {
            classNames: {
                input: 'bg-white dark:bg-gray-800 !important',
            },
        },
        Select: {
            classNames: {
                input: 'bg-white dark:bg-gray-800 !important',
            },
        },
        Badge: {
            classNames: {
                root: 'font-semibold !important',
            },
        },
    },
});

const ProviderComponent = ({ children }: IProps) => {
    return (
        <MantineProvider theme={theme}>
            <Provider store={store}>
                <DataCirculationProvider>
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Suspense fallback={<Loading />}>
                        <App>{children}</App>
                    </Suspense>
                </DataCirculationProvider>
            </Provider>
        </MantineProvider>
    );
};

export default ProviderComponent;
