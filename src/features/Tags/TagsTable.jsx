'use client';
import { useState, useMemo } from 'react';
import { DataTable } from 'mantine-datatable';
import { Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Edit, MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { sortBy } from 'lodash';
import CustomButton from '../../components/(personal)/global/CustomButton';
import CustomCard from '../../components/(personal)/global/CustomCard';
import ActionButtons from '../../components/(personal)/global/ActionButtons';
import AddTagsModal from './AddTagsModal';
import { useApiQuery } from '../../hooks/useApiQuery';
import { API_KEYS, API_ROUTES } from '../../config/api-routes';
import api from '../../hooks/AxiosInterceptor';



const TagsTable = () => {
    const [isOpen, setIsOpen] = useState(false);

    const fetchTags = async () => {
        try {
            const res = await api.get(API_ROUTES.CONTACTS.FETCHALLTAGS);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const { data, isLoading, isError, error, refetch } = useApiQuery([API_KEYS.CONTACTS.FETCHTAGS], fetchTags, {});


    return (
        <div className="space-y-4 !important">
            <CustomCard className="flex justify-end">
                <CustomButton onTrigger={() => setIsOpen(true)} type="submit" variant="primary" isAdd={true}>
                    Add Tag
                </CustomButton>
            </CustomCard>

            <CustomCard className="overflow-hidden border rounded-lg shadow-sm bg-white dark:bg-gray-800 !important">
                <DataTable
                    withTableBorder={false}
                    striped
                    highlightOnHover
                    records={data?.data}
                    className="w-full !important "
                    columns={[
                        {
                            accessor: 'name',
                            title: 'Name',
                            sortable: false,
                        },
                        {
                            accessor: 'description',
                            title: 'Description',
                            render: ({ description }) => <span className="text-sm text-gray-600 dark:text-gray-300 !important">{description}</span>,
                        },
                        {
                            accessor: 'category',
                            title: 'Category',
                            sortable: false,
                            render: ({ category }) => (
                                <Badge variant="outline" size="sm" className="text-xs font-medium !important">
                                    {category}
                                </Badge>
                            ),
                        },
                        {
                            accessor: 'createdAt',
                            title: 'Created',
                            sortable: false,
                            render: ({ createdAt }) => <span className="text-sm text-muted-foreground">{new Date(createdAt).toLocaleDateString()}</span>,
                        },
                        {
                            accessor: 'actions',
                            title: 'Actions',
                            textAlign: 'center',
                            render: (tag) => <ActionButtons />,
                        },
                    ]}
                    minHeight={200}
                    // noRecordsText=""
                    // withNoRecordsBorder={false}
                />

                <AddTagsModal isOpen={isOpen} onClose={() => setIsOpen(false)} revalidateTags={refetch} />
            </CustomCard>
        </div>
    );
};

export default TagsTable;
