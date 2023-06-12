import type { Conversation, Message } from '@prisma/client';
import axios from 'axios';
import type { ChatCompletionRequestMessage } from 'openai';
import { Configuration, OpenAIApi } from 'openai';
import FormData from 'form-data';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import {
  cardExplanationPrompt,
  explanationPrompt,
  feedbackPrompt,
  initialMessagePrompt,
  regeneratePrompt,
  responsePrompt,
  summaryPrompt,
} from '../prompts';

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

export async function getResponse(
  messages: ChatCompletionRequestMessage[]
): Promise<string | null> {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 1000,
    });

    const { data } = response;

    return data.choices[0].message?.content ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getInitialMesage(conversation: Partial<Conversation>) {
  console.time('getInitialMesage');
  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: await initialMessagePrompt(conversation as Conversation),
  };

  const response = await getResponse(
    [propmptMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getInitialMesage');
  return response;
}

export async function getAnswer(
  messages: Message[],
  conversation: Conversation
) {
  console.time('getAnswer');
  if (!messages || messages?.length === 0) {
    return;
  }

  const startIndex = Math.max(messages.length - 5, 0);

  const preparedMessages = messages.slice(startIndex).map((m) => ({
    role: m.role as ChatCompletionRequestMessageRoleEnum,
    content: m.text,
  }));

  const propmpt = await responsePrompt(conversation as Conversation);

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: propmpt,
  };

  const response = await getResponse(
    [propmptMessage, ...preparedMessages].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getAnswer');
  return response;
}

export async function createSummary(
  messages: Message[],
  conversation: Conversation
) {
  const startIndex = Math.max(messages.length - 5, 0);
  const lastFiveMessages = messages.slice(startIndex);

  const propmpt = await summaryPrompt.format({
    summary: conversation.summary || '',
    messages: lastFiveMessages
      .filter((m) => m.role !== ChatCompletionRequestMessageRoleEnum.System)
      .map(
        (m) =>
          `${
            m.role === ChatCompletionRequestMessageRoleEnum.User
              ? 'Student'
              : 'Teacher'
          }: ${m.text}`
      )
      .join('\n'),
  });

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: propmpt,
  };

  const response = await getResponse(
    [propmptMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );

  return response;
}

export async function getFeedback(
  message: Message,
  conversation: Conversation
) {
  console.time('getFeedback');
  if (!message) {
    return;
  }

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: await feedbackPrompt(conversation, message),
  };

  const response = await getResponse(
    [propmptMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getFeedback');
  return response;
}

export async function getExplanation(
  message: Message,
  conversation: Conversation,
  text: string
) {
  console.time('getExplanation');
  if (!message) {
    return;
  }

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: await explanationPrompt(conversation, message, text),
  };

  const response = await getResponse(
    [propmptMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getExplanation');
  return response;
}

export async function getCardExplanation(
  message: Message,
  conversation: Conversation,
  text: string
) {
  console.time('getCardExplanation');
  if (!message) {
    return;
  }

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: await cardExplanationPrompt(conversation, message, text),
  };

  const response = await getResponse(
    [propmptMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getCardExplanation');
  return response;
}

export async function regenerateAnswer(
  messages: Message[],
  conversation: Conversation
) {
  console.time('regenerateAnswer');
  if (!messages || messages?.length === 0) {
    return;
  }

  const messagesWithoutLast = messages.slice(0, messages.length - 1);
  const lastMessage = messages[messages.length - 1];

  const preparedMessages = messagesWithoutLast.map((m) => ({
    role: m.role as ChatCompletionRequestMessageRoleEnum,
    content: m.text,
  }));

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: await regeneratePrompt(conversation, lastMessage),
  };

  const response = await getResponse(
    [propmptMessage, ...preparedMessages].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );

  console.timeEnd('regenerateAnswer');
  return response;
}
