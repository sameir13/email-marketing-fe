'use client';
import React, { useState, useRef, useEffect } from 'react';
import EmailEditor from 'react-email-editor';
import { useForm } from 'react-hook-form';
import FormInput from '../../components/(personal)/global/FormInput';
import API_ROUTES, { API_KEYS } from '../../config/api-routes';
import { toast } from 'react-toastify';
import api from '../../hooks/AxiosInterceptor';
import { useCustomMutation } from '../../hooks/useCustomMutation';
import CustomButton from '../../components/(personal)/global/CustomButton';
import { useRouter, useSearchParams } from 'next/navigation';

function EmailEditorSection() {
    const { back } = useRouter();
    const emailEditorRef = useRef(null);
    const templateType = useSearchParams().get('mode');
    const templateId = useSearchParams().get('templateId');

    const { reset, control, handleSubmit } = useForm({
        defaultValues: {
            name: '',
            htmlContent: '',
            designJson: '',
            type: templateType,
        },
    });

    const exportHtml = () => {
        return new Promise((resolve) => {
            const unlayer = emailEditorRef.current?.editor;
            unlayer?.exportHtml((data) => {
                resolve(data);
            });
        });
    };


    const loadDesign = (data) => {
        const unlayer = emailEditorRef.current?.editor;
        unlayer?.loadDesign(data);
    };

    function onSuccess() {
        reset();
        back();
    }

    const createTemplate = async (data) => {
        try {
            const res = await api.post(API_ROUTES.TEMPLATE.ADDTEMPLATES, data);
            return res?.data;
        } catch (error) {
            if (error?.response?.data?.message) {
                return toast.error(error?.response?.data?.message);
            }
        }
    };

    const { mutate, isPending } = useCustomMutation(createTemplate, {
        invalidateKeys: [API_KEYS.TEMPLATES.GETALLTEMPLATES],
        refetchKeys: [API_KEYS.TEMPLATES.GETALLTEMPLATES],
        onSuccess: (data) => {
            if (data?.success) toast.success(data?.message);
            onSuccess();
        },
    });

    async function onSubmit(data) {
        const getTemplateHtml = await exportHtml();
        data.htmlContent = getTemplateHtml?.html ?? '';
        data.designJson = JSON.stringify(getTemplateHtml?.design);
        if (templateType === undefined || templateType === null) toast.error('Something went wrong!');
        mutate(data);
    }

    const resetEditorDesign = () => {
        const unlayer = emailEditorRef.current?.editor;
        if (unlayer) {
            unlayer.loadDesign({});
            console.log('Email editor design reset');
        }
    };

    const fetchTemplatesbyId = async () => {
        try {
            const res = await api.get(`${API_ROUTES.TEMPLATE.GETTEMPLATEBYID(templateId)}`);
            loadDesign(res?.data?.data?.designJson)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!templateId) return;
        fetchTemplatesbyId();
    }, [templateId]);

    return (
        <div className="flex flex-col h-screen">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between gap-2 p-4 border-b">
                    <div>
                        <FormInput name="name" control={control} placeholder="Define a template name" rules={{ required: 'Template name is required' }} />
                    </div>

                    <div className="flex items-center gap-2">
                        <CustomButton onTrigger={resetEditorDesign} variant="danger">
                            Discard
                        </CustomButton>
                        <CustomButton isPending={isPending} type="submit" variant="success">
                            Save Design
                        </CustomButton>
                    </div>
                </div>

                <div className="flex-1">
                    <EmailEditor
                        ref={emailEditorRef}
                        onLoad={() => {
                            console.log('Email editor loaded');
                        }}
                        onReady={() => {
                            console.log('Email editor ready');
                        }}
                        options={{
                            displayMode: 'email',
                            locale: 'en-US',
                        }}
                        tools={{
                            form: {
                                enabled: true,
                            },
                        }}
                        appearance={{
                            theme: 'light',
                            panels: {
                                tools: {
                                    dock: 'left',
                                },
                            },
                        }}
                    />
                </div>
            </form>
        </div>
    );
}

export default EmailEditorSection;
