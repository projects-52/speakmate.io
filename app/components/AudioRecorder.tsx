import type { Conversation, Message } from '@prisma/client';
import React, { useState, useEffect, useCallback } from 'react';
import { MicrophoneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type AudioRecorderProps = {
  onMessageReceived: (message: Message) => void;
  conversation: Conversation;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onMessageReceived,
  conversation,
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
      onMessageReceived(data);
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
      if (e.key === ' ' && !isRecording) {
        startRecording();
      }
    },
    [isRecording]
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
    <div className="flex items-center justify-center">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className="font-bold p-8 rounded mt-8 w-full bg-slate-100"
        disabled={isLoading}
      >
        {isRecording && (
          <span className="flex items-center justify-center">
            <MicrophoneIcon className="w-10 h-10 pulse" />
            Listening...
          </span>
        )}
        {isLoading && (
          <span className="flex items-center justify-center ">
            <ArrowPathIcon className="w-10 h-10 rotate" />
            Processing...
          </span>
        )}
        {!isRecording && !isLoading && (
          <span className="flex items-center justify-center">
            <MicrophoneIcon className="w-10 h-10" />
            Hold Space to speak
          </span>
        )}
      </button>
    </div>
  );
};

export default AudioRecorder;
