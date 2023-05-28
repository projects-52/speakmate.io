import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { Conversation } from '@prisma/client';
import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

interface FeedbackPopupProps {
  conversation: Conversation | null;
  onClose: () => void;
}

export default function ConversationPopup({
  onClose,
  conversation,
}: FeedbackPopupProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (!conversation) {
      setIsDeleting(false);
    }
  }, [conversation]);

  if (!conversation) {
    return null;
  }
  return (
    <Transition.Root show={!!conversation} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-light-shades-500 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="flex">
                  <img
                    className="w-20 h-20 rounded-full bg-slate-300 text-white flex items-center justify-center mr-2"
                    src={`/characters/${conversation.character?.slug}.png`}
                    alt={conversation.character?.name}
                  />
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {conversation.name}
                    </Dialog.Title>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  {isDeleting ? (
                    <div className="flex gap-4">
                      <Form
                        method="delete"
                        action={`/api/conversations/${conversation.id}`}
                        className="w-full"
                      >
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-dark-accent-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent-700"
                        >
                          {t('conversation.delete.confirm')}
                        </button>
                      </Form>
                      <button
                        className="inline-flex w-full justify-center rounded-md text-dark-accent-500 px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:dark-accent-500"
                        onClick={() => setIsDeleting(false)}
                      >
                        {t('conversation.delete.cancel')}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsDeleting(true)}
                        className="inline-flex w-full justify-center rounded-md bg-dark-accent-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent-700"
                      >
                        {t('conversation.delete.title')}
                      </button>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md text-dark-accent-500 px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent-7s00"
                        onClick={onClose}
                      >
                        {t('conversation.delete.close')}
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
