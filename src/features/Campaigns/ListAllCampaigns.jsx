'use client';
import React, { useState } from 'react';
import CreateCampaignModal from './CreateCampaignModal';
import CustomButton from '../../components/(personal)/global/CustomButton';
import API_ROUTES, { API_KEYS } from '../../config/api-routes';
import { useApiQuery } from '../../hooks/useApiQuery';
import api from '../../hooks/AxiosInterceptor';
import { DataTable } from 'mantine-datatable';
import ActionButtons from '../../components/(personal)/global/ActionButtons';
import SuspenseLoader from '../../components/(personal)/global/Loaders/SuspenseLoader';
import ProgressCircle from '../../components/(personal)/global/ProgressCircle';
import CustomCard from '../../components/(personal)/global/CustomCard';

const ListAllCampaigns = () => {
    const [isOpen, setIsOpen] = useState(false);

    const fetchAllCampaigns = async () => {
        try {
            const res = await api.get(`${API_ROUTES.CAMPAIGN.FETCHALLCAMPS}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const { data, isPending, isError, error, refetch } = useApiQuery([API_KEYS.CAMPAIGN.GETALLCAMPAIGNS], fetchAllCampaigns, {});

    console.log('campaign data', data);

    function renderStatusBadge(status) {
        switch (status) {
            case 'completed':
                return 'text-green-500';
            case 'scheduled':
                return 'text-yellow-600';
        }
    }

    return (
        <div className="flex flex-col gap-3 justify-stretch">
            <CustomCard className="flex justify-end">
                <CustomButton onTrigger={() => setIsOpen(true)} type="submit" variant="primary" isAdd={true}>
                    Create Campaign
                </CustomButton>
            </CustomCard>

            <CustomCard className="flex justify-end">
                {!isPending ? (
                    <DataTable
                        withTableBorder={false}
                        striped
                        highlightOnHover
                        records={data?.data}
                        className="w-full !important "
                        columns={[
                            {
                                accessor: 'name',
                                title: 'Campaign Name',
                                sortable: false,
                            },
                            {
                                accessor: 'startDate',
                                title: 'Start Date',
                                sortable: false,
                                render: ({ startDate }) => {
                                    var formatedDate = new Date(startDate).toLocaleDateString();
                                    return <span>{formatedDate}</span>;
                                },
                            },

                            {
                                accessor: 'totalContacts',
                                title: 'Total Contacts',
                                sortable: false,
                            },
                            {
                                accessor: 'startTime',
                                title: 'Start Date',
                                sortable: false,
                            },
                            {
                                accessor: 'progress',
                                title: 'Progress',
                                sortable: false,
                                render: ({ progress }) => {
                                    var progressValue = parseInt(progress);
                                    return (
                                        <>
                                            <ProgressCircle size={'50px'} value={progressValue} />
                                        </>
                                    );
                                },
                            },
                            {
                                accessor: 'failedCount',
                                title: 'Failed Count',
                                sortable: false,
                                render: ({ failedCount }) => {
                                    return <span className="text-red-600 text-md">{failedCount}</span>;
                                },
                            },

                            {
                                accessor: 'status',
                                title: 'Status',
                                sortable: false,
                                render: ({ status }) => {
                                    return <div className={`${renderStatusBadge(status)} `}>{status?.toUpperCase()}</div>;
                                },
                            },

                            {
                                accessor: 'createdAt',
                                title: 'Created At',
                                sortable: false,
                                render: ({ createdAt }) => <span>{new Date(createdAt).toLocaleDateString()}</span>,
                            },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                textAlign: 'center',
                                render: (tag) => <ActionButtons />,
                            },
                        ]}
                        minHeight={200}
                    />
                ) : (
                    <SuspenseLoader minHeight={400} />
                )}
            </CustomCard>

            <CreateCampaignModal revalidate={refetch} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

export default ListAllCampaigns;
