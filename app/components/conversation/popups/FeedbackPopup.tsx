import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { Conversation, Feedback, Message } from '@prisma/client';

interface FeedbackPopupProps {
  conversation: Conversation;
  message: Message;
  onClose: () => void;
  show: boolean;
}

export default function FeedbackPopup({
  onClose,
  conversation,
  show,
  message,
}: FeedbackPopupProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | undefined>();

  useEffect(() => {
    if (!feedback) {
      onGetFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const onGetFeedback = async () => {
    setLoading(true);
    const response = await fetch(`/api/ai/feedback`, {
      method: 'POST',
      body: JSON.stringify({
        messageId: message?.id,
      }),
    });
    const feedback = await response.json();
    setFeedback(feedback);
    setLoading(false);
  };

  return (
    <Transition.Root show={show} as={Fragment}>
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
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      className="w-28 h-28 rounded-full bg-slate-300 text-white flex items-center justify-center"
                      src={`/characters/${conversation.character?.slug}.png`}
                      alt={conversation.character?.name}
                    />
                    {loading ? (
                      <div className="w-full h-full rounded-full border-4 border-l-blue-300 border-r-transparent border-t-transparent border-b-transparent absolute -top-1 -left-1 animate-spin box-content"></div>
                    ) : null}
                  </div>
                  {feedback ? (
                    <div className="w-full mt-4 whitespace-pre-line">
                      {feedback?.text}
                    </div>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
