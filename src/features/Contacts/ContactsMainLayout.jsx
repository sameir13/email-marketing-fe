'use client';
import { DataTable } from 'mantine-datatable';
import { useMemo, useState } from 'react';
import CustomCard from '../../components/(personal)/global/CustomCard';
import CustomButton from '../../components/(personal)/global/CustomButton';
import CreateContactListModal from './CreateContactListModal';
import API_ROUTES, { API_KEYS } from '../../config/api-routes';
import { useApiQuery } from '../../hooks/useApiQuery';
import api from '../../hooks/AxiosInterceptor';
import SuspenseLoader from '../../components/(personal)/global/Loaders/SuspenseLoader';
import { Database, FilterIcon } from 'lucide-react';
import GlobalDropdown from '../../components/(personal)/global/GlobalDropdown';
import ActionButtons from '../../components/(personal)/global/ActionButtons';

export default function ContactsMainLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const [listFilterValue, setlistFilterValue] = useState('all');

    const fetchContacts = async () => {
        try {
            const res = await api.get(`${API_ROUTES.CONTACTS.GETCONTACTLIST}?listName=${listFilterValue}`);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const { data, isPending, isError, error, refetch } = useApiQuery([API_KEYS.CONTACTS.GETCONTACTLIST, listFilterValue], fetchContacts, {});

    const dropdownOptions = useMemo(() => {
        return [
            { label: 'All', value: 'all' },
            ...(data?.listNames || []).map((item) => ({
                label: item,
                value: item,
            })),
        ];
    }, [data, isPending]);

    return (
        <div className="space-y-4 !important">
            <CustomCard className="flex justify-end">
                <CustomButton onTrigger={() => setIsOpen(true)} type="submit" variant="primary" isAdd={true}>
                    Add List
                </CustomButton>
            </CustomCard>

            <CustomCard className="overflow-hidden border rounded-lg shadow-sm flex flex-col gap-3 bg-white dark:bg-gray-800 !important">
                <div className="flex justify-end">
                    <GlobalDropdown
                        icon={<FilterIcon className="w-4 h-4" />}
                        buttonLabel={`${listFilterValue != 'all' ? listFilterValue : 'Filter by List'}`}
                        options={dropdownOptions}
                        onSelect={(value) => {
                            setlistFilterValue(value);
                            refetch();
                        }}
                    />
                </div>

                {!isPending ? (
                    <DataTable
                        withTableBorder={false}
                        striped
                        highlightOnHover
                        records={data?.data}
                        className="w-full !important "
                        columns={[
                            {
                                accessor: 'email',
                                title: 'Email',
                                sortable: false,
                            },
                            {
                                accessor: 'listName',
                                title: 'List Name',
                                sortable: false,
                            },
                            {
                                accessor: 'gender',
                                title: 'Gender',
                                sortable: false,
                            },
                            {
                                accessor: 'category',
                                title: 'Category',
                                sortable: false,
                                render: ({ firstName, lastName }) => <span>{`${firstName} ${lastName}`}</span>,
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

            <CreateContactListModal revalidateContactList={refetch} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
