import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { Conversation, Explanation, Message } from '@prisma/client';
import { Button } from '~/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@remix-run/react';
import { SpeakIcon } from '~/components/ui/SpeakIcon';

interface ExplanationPopupProps {
  conversation: Conversation;
  explanation?: Explanation;
  message: Message;
  text: string;
  onClose: () => void;
  show: boolean;
  onAddExplanation: (explanation: Explanation) => void;
}

function wrapWithBrackets(str: string | null): string {
  if (!str) return '';

  if (!str.startsWith('[') || !str.endsWith(']')) {
    return `[${str}]`;
  }
  return str;
}

export default function ExplanationPopup({
  onClose,
  conversation,
  show,
  explanation,
  message,
  text,
  onAddExplanation,
}: ExplanationPopupProps) {
  const [loading, setLoading] = useState(false);
  // const [addingToCards, setAddingToCards] = useState(false);
  // const [doesCardExist, setDoesCardExist] = useState<
  //   'checking' | 'exists' | 'not-exists'
  // >('checking');
  const [existingExplanation, setExistingExplanation] = useState<
    Explanation | undefined
  >(explanation);

  // const { t } = useTranslation();
  // const navigate = useNavigate();

  useEffect(() => {
    if (!explanation) {
      onGetExplanation();
    }

    // if (doesCardExist === 'checking') {
    //   onGetCard(text);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    setExistingExplanation(explanation);
  }, [explanation]);

  const onGetExplanation = async () => {
    if (text === '') return;
    setLoading(true);
    const response = await fetch(`/api/ai/explanation`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        messageId: message?.id,
      }),
    });
    const explanation = await response.json();

    onAddExplanation(explanation);
    // setDoesCardExist('not-exists');
    setExistingExplanation(explanation);
    setLoading(false);
  };

  // const onGetCard = async (text: string) => {
  //   // @ts-ignore
  //   if (!existingExplanation?.explanation.original) {
  //     setDoesCardExist('not-exists');
  //     return;
  //   }
  //   const response = await fetch(`/api/card/fetch`, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       // @ts-ignore
  //       text: existingExplanation?.explanation.original,
  //     }),
  //   });

  //   const card = await response.json();
  //   if (card) {
  //     setDoesCardExist('exists');
  //   } else {
  //     setDoesCardExist('not-exists');
  //   }
  // };

  // const onAddToCards = async () => {
  //   if (doesCardExist !== 'not-exists') {
  //     navigate('/app/cards');
  //     return;
  //   }

  //   setAddingToCards(true);
  //   await fetch('/api/card/add', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       messageId: message?.id,
  //       // @ts-ignore
  //       text: existingExplanation?.explanation.original,
  //     }),
  //   });
  //   setDoesCardExist('exists');
  //   setAddingToCards(false);
  // };

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
                  {existingExplanation ? (
                    <div>
                      {/** @ts-ignore */}
                      <p className="text-slate-500 text-2xl font-bold flex justify-between items-center">
                        {/** @ts-ignore */}
                        {existingExplanation?.explanation.highlighted}

                        <SpeakIcon
                          language={conversation.language as string}
                          gender={conversation.character?.gender as string}
                          // @ts-ignore
                          text={existingExplanation?.explanation.original}
                        />
                      </p>
                      <p className="text-slate-500 text-lg">
                        {wrapWithBrackets(
                          // @ts-ignore
                          existingExplanation?.explanation.transcription
                        )}
                      </p>
                      <p className="text-slate-500 text-md font-bold">
                        {/** @ts-ignore */}
                        {existingExplanation?.explanation.translation}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {/** @ts-ignore */}
                        {existingExplanation?.explanation.explanation}
                      </p>

                      {/* <Button onClick={onAddToCards} loading={addingToCards}>
                        {doesCardExist === 'exists'
                          ? t('cards.check')
                          : t('cards.add')}
                      </Button> */}
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
