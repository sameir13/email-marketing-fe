import axios from 'axios';
import React from 'react';
import GlobalModal from '../../components/(personal)/global/GlobalModal';
import CustomButton from '../../components/(personal)/global/CustomButton';
import { useCustomMutation } from '../../hooks/useCustomMutation';
import FormInput from '../../components/(personal)/global/FormInput';
import { useForm } from 'react-hook-form';
import api from '../../hooks/AxiosInterceptor';
import API_ROUTES, { API_KEYS } from '../../config/api-routes';
import { toast } from 'react-toastify';

const createUser = async (data) => {
    try {
        const res = await api.post(API_ROUTES.CONTACTS.ADDTAGS, data);
        return res.data;
    } catch (error) {
        if (error?.response?.data?.message) {
            toast.error(error?.response?.data?.message);
        }
    }
};

const AddTagsModal = ({ isOpen, onClose, revalidateTags }) => {
    const { handleSubmit, control, reset } = useForm({
        defaultValues: { name: '' },
    });

    function onSuccess() {
        onClose();
        reset();
        revalidateTags();
    }

    const { mutate, isPending } = useCustomMutation(createUser, {
        invalidateKeys: [[API_KEYS.CONTACTS.FETCHTAGS]],
        onSuccess: (data) => {
            if (data?.success) toast.success(data?.message);
            onSuccess();
        },
    });

    const onSubmit = (data) => {
        mutate(data);
    };

    return (
        <GlobalModal isOpen={isOpen} onClose={onClose} title="Add Contact Tags" size="max-w-lg" isPending={false}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput name="name" control={control} label="Tag Name" placeholder="Enter your name" rules={{ required: 'Name is required' }} />

                <div className="flex justify-end gap-2">
                    <CustomButton onTrigger={onClose} variant="danger">
                        Cancel
                    </CustomButton>
                    <CustomButton isPending={isPending} type="submit" variant="success">
                        Add
                    </CustomButton>
                </div>
            </form>
        </GlobalModal>
    );
};

export default AddTagsModal;
