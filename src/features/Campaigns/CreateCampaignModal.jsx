'use client';
import React, { useMemo } from 'react';
import GlobalModal from '../../components/(personal)/global/GlobalModal';
import CustomCard from '../../components/(personal)/global/CustomCard';
import { useForm } from 'react-hook-form';
import FormInput from '../../components/(personal)/global/FormInput';
import FormDropdown from '../../components/(personal)/global/FormDropdown';
import useContacts from '../../hooks/useContacts';
import FormMultiSelect from '../../components/(personal)/global/FormMultiSelect';
import useSenders from '../../hooks/useSenders';
// import { useApiQuery } from '../../hooks/useApiQuery';
import API_ROUTES, { API_KEYS } from '../../config/api-routes';
import api from '../../hooks/AxiosInterceptor';
import useTemplates from '../../hooks/useTemplates';
import { toast } from 'react-toastify';
import { useCustomMutation } from '../../hooks/useCustomMutation';
import CustomButton from '../../components/(personal)/global/CustomButton';
import { timeOptions } from '../../constants/data';
const moment = require('moment-timezone');

const CreateCampaignModal = ({ isOpen, onClose, revalidate }) => {
    const { data: ContactList, isPending: ContactListPending } = useContacts();
    const { data: SendersList, isPending: SendersListPending } = useSenders();
    const { data: TemplateList, isPending: TemplatesListPending } = useTemplates();
    const { reset, control, handleSubmit } = useForm({
        defaultValues: {
            name: '',
            contactListName: '',
            senderIds: [],
            startDate: '',
            templateId: '',
            startTime: '',
        },
    });

    const structuredContactLis = useMemo(() => {
        return ContactList?.data?.map((items) => {
            return {
                value: items?.listName,
                label: items?.listName,
            };
        });
    }, [ContactList]);

    const senderListOption = useMemo(() => {
        return SendersList?.data?.map((items) => {
            return {
                value: items?.id,
                label: items?.fromEmail,
            };
        });
    }, [SendersList]);

    const templateNamesOptions = useMemo(() => {
        return TemplateList?.data?.map((items) => {
            return {
                value: items?.id,
                label: items?.name,
            };
        });
    }, [TemplateList]);

    const launchCampaign = async (data) => {
        try {
            const res = await api.post(API_ROUTES.CAMPAIGN.LAUNCHCAMPAIGN, data);
            return res.data;
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            }
        }
    };

    // const timezoneOptions = useMemo(() => {
    //     return moment.tz.names().map((zone) => ({
    //         label: `${zone} (UTC${moment.tz(zone).format('Z')})`,
    //         value: zone,
    //     }));
    // }, []);

    // console.log('timezoneOptions', timezoneOptions);

    const timeMemo = useMemo(() => {
        return timeOptions;
    }, [timeOptions]);

    const { mutate, isPending } = useCustomMutation(launchCampaign, {
        onSuccess: (data) => {
            revalidate();
            if (data?.success) toast.success(data?.message);
            onClose()
        },
    });

    function onSubmit(data) {
        mutate(data);
    }



    return (
        <GlobalModal isOpen={isOpen} onClose={onClose} title="Create Campaign" size="max-w-lg" isPending={false}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CustomCard>
                    <div>
                        <FormInput name="name" label={'Campaign name'} control={control} placeholder="Add a Campaign Name" rules={{ required: 'Campaign name is required' }} />
                    </div>
                    <div>
                        <FormInput
                            type="date"
                            name="startDate"
                            label="Start Date"
                            control={control}
                            placeholder="Select start date"
                            rules={{
                                required: 'Start date is required',
                                validate: {
                                    futureDate: (value) => {
                                        const selectedDate = new Date(value);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return selectedDate > today || 'Please select a future date';
                                    },
                                },
                            }}
                        />
                    </div>

                    <FormDropdown
                        name="contactListName"
                        control={control}
                        label="Contact list name"
                        badgeText="Required"
                        badgeVariant="danger"
                        options={structuredContactLis}
                        disabled={ContactListPending}
                        rules={{ required: 'This field is required' }}
                    />

                    <FormDropdown name="startTime" control={control} label="Start time" badgeText="Required" badgeVariant="danger" options={timeMemo} rules={{ required: 'This field is required' }} />

                    <FormMultiSelect
                        name="senderIds"
                        control={control}
                        label="Sender accounts"
                        badgeText="Required"
                        badgeVariant="danger"
                        disabled={SendersListPending}
                        options={senderListOption}
                        rules={{ required: 'Select at least one sender' }}
                    />

                    <FormDropdown
                        name="templateId"
                        control={control}
                        label="Template name"
                        badgeText="Required"
                        badgeVariant="danger"
                        options={templateNamesOptions}
                        disabled={TemplatesListPending}
                        rules={{ required: 'Select a template' }}
                    />

                    <div className="flex justify-end gap-2">
                        {/* <CustomButton onTrigger={onClose} variant="danger">
                            Cancel
                        </CustomButton> */}
                        <CustomButton isPending={isPending} type="submit" variant="success">
                            Add
                        </CustomButton>
                    </div>
                </CustomCard>
            </form>
        </GlobalModal>
    );
};

export default CreateCampaignModal;
