import axios from 'axios';
// import { Configuration, OpenAIApi } from 'openai';
import FormData from 'form-data';

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY as string;

// const configuration = new Configuration({
//   apiKey: OPEN_AI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

export async function transcribeAudio(buffer: Buffer, file: File) {
  try {
    const formData = new FormData();

    formData.append('file', buffer, {
      filename: file.name,
      contentType: 'webm',
    });

    formData.append('model', 'whisper-1');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${OPEN_AI_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error?.message);
  }
}
