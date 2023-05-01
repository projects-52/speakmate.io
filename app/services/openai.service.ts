import type { Message } from '@prisma/client';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import FormData from 'form-data';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY as string;

const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

export async function getAnswer(messages: Message[]) {
  if (!messages || messages?.length === 0) {
    return;
  }

  const preparedMessages = messages.map((m) => ({
    role: m.role as ChatCompletionRequestMessageRoleEnum,
    content: m.text,
  }));

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: `
    You're the language learning assistant. You will try to keep converstion with the user in the language they are learning.
    You will try to adapt to the user's level of language proficiency.
    You will try to keep the conversation going.
    You will try to keep the conversation interesting.
    You will actively propose topics and questions to the user.
    You wouldn't try to correct the user's mistakes.
    `,
  };

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [propmptMessage, ...preparedMessages].map((m) => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: 1000,
    });

    const { data } = response;

    return data.choices[0].message?.content;
  } catch (error) {
    console.error(error);
    return null;
  }
}
