import React, { useRef, useState, useCallback, useMemo } from 'react';
import GlobalModal from '../../components/(personal)/global/GlobalModal';
import CustomButton from '../../components/(personal)/global/CustomButton';
import { useForm } from 'react-hook-form';
import FormInput from '../../components/(personal)/global/FormInput';
import { UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../hooks/AxiosInterceptor';
import { useCustomMutation } from '../../hooks/useCustomMutation';
import API_ROUTES from '../../config/api-routes';
import axios from 'axios';

function bytesToReadable(size) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const CreateContactListModal = ({ isOpen, onClose, revalidateContactList }) => {
    const { reset, getValues, control, handleSubmit } = useForm({
        defaultValues: { listName: '' },
    });

    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalUploaded, setTotalUploaded] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const inputRef = useRef(null);

    const accept = '.csv';
    const isCsv = useCallback((f) => {
        const byMime = f.type === 'text/csv' || f.type === 'application/vnd.ms-excel';
        const byExt = f.name.toLowerCase().endsWith('.csv');
        return byMime || byExt;
    }, []);

    const onSelectFile = useCallback(
        (f) => {
            setError(null);
            setTotalUploaded(null);
            setJsonData(null);
            if (!f) {
                setFile(null);
                return;
            }
            if (!isCsv(f)) {
                setFile(null);
                setError('Please upload a valid .csv file.');
                return;
            }
            setFile(f);
        },
        [isCsv],
    );

    const onBrowseClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const onKeyActivate = useCallback(
        (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onBrowseClick();
            }
        },
        [onBrowseClick],
    );

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const dropped = e.dataTransfer?.files?.[0];
            if (dropped) onSelectFile(dropped);
        },
        [onSelectFile],
    );

    const handleInputChange = useCallback(
        (e) => {
            const selected = e.target.files?.[0] ?? null;
            onSelectFile(selected);
        },
        [onSelectFile],
    );

    const handleRemove = useCallback(() => {
        setFile(null);
        setError(null);
        setTotalUploaded(null);
        setJsonData(null);
        if (inputRef.current) inputRef.current.value = '';
    }, []);

    const uploadingLabel = useMemo(() => (loading ? 'Uploading...' : 'Upload'), [loading]);

    const handleUpload = useCallback(
        async (e) => {
            e.preventDefault();
            setError(null);
            setTotalUploaded(null);
            setJsonData(null);

            if (!file) {
                toast.error('Please select a CSV file before uploading.');
                return;
            }

            setLoading(true);
            try {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('listName', getValues('listName') || '');

                const res = await axios.post('/api/upload', fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = res.data;
                setJsonData(data?.data ?? null);
                setTotalUploaded(data?.data?.length ?? null);
            } catch (err) {
                if (err?.response?.data?.error) {
                    toast.error(err?.response?.data?.error);
                }
            } finally {
                setLoading(false);
            }
        },
        [file, getValues],
    );

    const createContactList = async (data) => {
        try {
            const res = await api.post(API_ROUTES.CONTACTS.CREATECONTACTLIST, data);
            return res?.data;
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            }
        }
    };


    function onCancel(){
        setError(null);
        setTotalUploaded(null);
        setJsonData(null);
        setFile(null)
        reset();
        onClose();
    }

    function onSuccess() {
        onCancel()
        revalidateContactList()
    }

    const { mutate, isPending } = useCustomMutation(createContactList, {
        onSuccess: (data) => {
            if (data?.success) toast.success(data?.message);
            onSuccess();
        },
    });

    const onSubmit = (data) => {
        data.list = jsonData;
        mutate(data);
    };

    return (
        <GlobalModal isOpen={isOpen} onClose={onCancel} title="Add Contact List" size="max-w-lg" isPending={false}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput name="listName" control={control} label="List Name" placeholder="Enter list name" rules={{ required: 'Name is required' }} />

                <div className="flex flex-col gap-3 mt-5">
                    <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={onKeyActivate}
                        onClick={onBrowseClick}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        aria-label="Upload CSV via drag and drop or click to browse"
                        className={[
                            'relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed px-6 py-12 text-center transition-colors',
                            isDragging ? 'border-primary bg-muted/50' : 'border-border bg-muted/30',
                        ].join(' ')}
                    >
                        <UploadCloud className="w-6 h-6" />

                        <div className="max-w-[28rem]">
                            <p className="text-sm">
                                Drag and drop your CSV here, or <span className="font-medium underline text-primary underline-offset-4">browse</span>
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">Only .csv files are supported</p>
                        </div>

                        <input ref={inputRef} type="file" name="csv" accept={accept} onChange={handleInputChange} className="sr-only" aria-hidden="true" />
                    </div>

                    {file && (
                        <div className="flex items-start justify-between p-3 mb-10 border rounded-md border-border bg-background">
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate" title={file.name}>
                                    {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">{bytesToReadable(file.size)}</p>
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={handleRemove} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted">
                                    Remove
                                </button>
                                <button onClick={handleUpload} disabled={loading} className="text-white btn bg-primary">
                                    {uploadingLabel}
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 text-sm border rounded-md border-destructive/40 bg-destructive/10">
                            <strong className="mr-1">Error:</strong>
                            {error}
                        </div>
                    )}

                    {loading && <div className="p-3 text-sm border rounded-md border-primary/40 bg-primary/10">Uploading and processing...</div>}

                    {totalUploaded != null && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold">Result</h3>
                            <pre className="p-3 overflow-auto text-xs border rounded-md max-h-96 border-border bg-muted/50">{`Total ${totalUploaded} has been processed!`}</pre>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-8">
                    <CustomButton onTrigger={onCancel} variant="danger">
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

export default CreateContactListModal;
