import type { Conversation, Message } from '@prisma/client';
import React, { useState, useEffect, useCallback } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/outline';

type AudioRecorderProps = {
  onMessageReceived: (message: Message) => void;
  conversation: Conversation;
  disabled?: boolean;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onMessageReceived,
  conversation,
  disabled,
}) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResponse = async (response: Response) => {
    if (response.ok) {
      const data: Message = await response.json();
      if (data !== null) {
        onMessageReceived(data);
      }
    } else {
      console.error('Failed to fetch response');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isRecording && chunks.length > 0) {
      setIsLoading(true);
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setChunks([]);

      const formData = new FormData();
      formData.append('audio', blob, 'recorded_audio.webm');
      formData.append('conversationId', conversation.id);
      formData.append('userId', conversation.userId);

      fetch('/api/ai/speech', {
        method: 'POST',
        body: formData,
      }).then(handleResponse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, chunks, onMessageReceived, conversation]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
    });
    setMediaRecorder(recorder);

    recorder.ondataavailable = (e) => {
      setChunks((prevChunks) => [...prevChunks, e.data]);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ' && !isRecording && !disabled) {
        startRecording();
      }
    },
    [isRecording, disabled]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ' && isRecording) {
        stopRecording();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isRecording]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="w-10 h-10 text-slate-500 p-2 rounded-full relative hover:bg-blue-200 hover:text-slate-50">
      {isRecording && (
        <div className="w-full h-full rounded-full bg-blue-300 absolute top-0 left-0 animate-ping"></div>
      )}

      {isLoading && (
        <div className="w-full h-full rounded-full border-2 border-l-blue-300 border-r-transparent border-t-transparent border-b-transparent absolute top-0 left-0 animate-spin"></div>
      )}

      <MicrophoneIcon
        className="rounded-full z-10 relative cursor-pointer"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
      />
    </div>
  );
};

export default AudioRecorder;
