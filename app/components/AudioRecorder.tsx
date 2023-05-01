import React, { useState, useEffect } from 'react';

const AudioRecorder: React.FC = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!isRecording && chunks.length > 0) {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setChunks([]);

      const formData = new FormData();
      formData.append('audio', blob, 'recorded_audio.webm');

      fetch('/api/ai/speech', {
        method: 'POST',
        body: formData,
      });
    }
  }, [isRecording, chunks]);

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

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
    >
      Hold to Record
    </button>
  );
};

export default AudioRecorder;
