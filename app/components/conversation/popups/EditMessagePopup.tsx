import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { Message } from '@prisma/client';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/Button';

interface EditMessagePopupProps {
  message: Message | null;
  nextMessage?: Message;
  onClose: () => void;
  onEditMessage: (message: Message, nextMessage?: Message) => void;
}

export default function EditMessagePopup({
  onClose,
  message,
  nextMessage,
  onEditMessage,
}: EditMessagePopupProps) {
  const [text, setText] = useState(message?.text || '');

  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const onEdit = async () => {
    setLoading(true);
    const response = await fetch('/api/messages/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId: message?.id,
        nextMessageId: nextMessage?.id,
        text,
      }),
    });

    const data = await response.json();

    onEditMessage(data[0], data[1]);

    setLoading(false);

    onClose();
  };

  if (!message) {
    return null;
  }
  return (
    <Transition.Root show={!!message} as={Fragment}>
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
                <div className="bg-light-accent-300 text-white inline-block rounded-md px-4 py-2 w-full">
                  {message.text}
                </div>

                <div className="mt-4">
                  <textarea
                    className="w-full rounded-lg border-slate-500 p-4 resize-none focus:outline-blue-300 border-0 shadow-sm"
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                  />
                </div>

                <Button
                  onClick={onEdit}
                  disabled={loading || text === message.text}
                  loading={loading}
                >
                  {t('message.edit.send')}
                </Button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
