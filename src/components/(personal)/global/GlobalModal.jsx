'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

const GlobalModal = ({ isOpen, onClose, title, children, footer = null, size = 'max-w-2xl', isPending = false, closeButton = true }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={isPending ? () => {} : onClose} // prevent closing while pending
            >
                {/* Backdrop */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal container */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4">
                        {/* Modal panel */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full ${size} transform overflow-hidden rounded-lg bg-white shadow-xl transition-all`}>
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                    {title && <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>}
                                    {closeButton && (
                                        <button type="button" disabled={isPending} className="ml-4 text-gray-400 hover:text-gray-600 disabled:opacity-50" onClick={onClose}>
                                            <X className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>

                                {/* Body */}
                                <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>

                                {/* Footer */}
                                {footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default GlobalModal;
