import type { Message, Conversation } from '@prisma/client';
import { useState } from 'react';
import EditMessagePopup from '../popups/EditMessagePopup';
import FeedbackPopup from '../popups/FeedbackPopup';
import { useTranslation } from 'react-i18next';

interface UserMessageProps {
  conversation: Conversation;
  message: Message;
  nextMessage?: Message;
  canBeEdited?: boolean;
  onEditMessage: (message: Message, nextMessage?: Message) => void;
}

export default function UserMessage({
  message,
  canBeEdited,
  onEditMessage,
  nextMessage,
  conversation,
}: UserMessageProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showFeedback, setFeedback] = useState<boolean>(false);

  const { t } = useTranslation();

  return (
    <div key={message.id} className="text-right mb-2">
      <div className="text-slate-100 bg-light-accent-300 inline-block rounded-md px-4 py-2 m-1 max-w-lg">
        {message.text}

        <div className="mt-2 flex gap-2">
          {canBeEdited && (
            <span
              className="text-xs text-gray-200 cursor-pointer"
              onClick={() => setShowEdit(true)}
            >
              {t('message.edit.title')}
            </span>
          )}
          <span
            className="text-xs text-gray-200 cursor-pointer"
            onClick={() => setFeedback(true)}
          >
            {t('message.feedback')}
          </span>
        </div>
      </div>
      {showFeedback && (
        <FeedbackPopup
          show={showFeedback}
          onClose={() => setFeedback(false)}
          message={message}
          conversation={conversation}
        />
      )}

      {showEdit && (
        <EditMessagePopup
          message={message}
          nextMessage={nextMessage}
          onClose={() => setShowEdit(false)}
          onEditMessage={onEditMessage}
        />
      )}
    </div>
  );
}
