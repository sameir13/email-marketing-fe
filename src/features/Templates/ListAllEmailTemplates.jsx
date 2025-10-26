'use client';
import { DataTable } from 'mantine-datatable';
import { useMemo, useState } from 'react';
import CustomCard from '../../components/(personal)/global/CustomCard';
import CustomButton from '../../components/(personal)/global/CustomButton';
import API_ROUTES, { API_KEYS } from '../../config/api-routes';
import { useApiQuery } from '../../hooks/useApiQuery';
import api from '../../hooks/AxiosInterceptor';
import SuspenseLoader from '../../components/(personal)/global/Loaders/SuspenseLoader';
import { Database, FilterIcon } from 'lucide-react';
import GlobalDropdown from '../../components/(personal)/global/GlobalDropdown';
import ActionButtons from '../../components/(personal)/global/ActionButtons';
import { PaintRoller, MailIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function ListAllEmailTemplates() {
    const { push } = useRouter();
    const pathname = usePathname();

    const fetchTemplates = async () => {
        try {
            const res = await api.get(`${API_ROUTES.TEMPLATE.GETALLTEMPLATES}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const { data, isPending } = useApiQuery([API_KEYS.TEMPLATES.GETALLTEMPLATES], fetchTemplates, {});

    return (
        <div className="space-y-4 !important">
            <CustomCard className="flex justify-end">
                <GlobalDropdown
                    buttonLabel={`Create A Template`}
                    options={[
                        {
                            label: 'Text Template',
                            value: 'textEmail',
                            icon: <MailIcon className="w-3 h-3" />,
                        },
                        {
                            label: 'Design Template',
                            value: 'designTemplate',
                            icon: <PaintRoller className="w-3 h-3" />,
                        },
                    ]}
                    onSelect={(value) => {
                        push(`${pathname}/create?mode=${value}`);
                    }}
                />
            </CustomCard>

            <CustomCard className="overflow-hidden border rounded-lg shadow-sm flex flex-col gap-3 bg-white dark:bg-gray-800 !important">
                <div className="flex justify-end"></div>

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
                                title: 'Template Name',
                                sortable: false,
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
                                render: ({ id, type }) => (
                                    <ActionButtons
                                        onEdit={() => {
                                            push(`${pathname}/create?mode=${type}&templateId=${id}`);
                                        }}
                                    />
                                ),
                            },
                        ]}
                        minHeight={200}
                    />
                ) : (
                    <SuspenseLoader minHeight={400} />
                )}
            </CustomCard>
        </div>
    );
}
