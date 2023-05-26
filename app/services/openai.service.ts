import type { Conversation, Message } from '@prisma/client';
import axios from 'axios';
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
} from '../prompts';
import { getLearningStyle } from '~/prompts/learningStyles';

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

export async function getInitialMesage(conversation: Partial<Conversation>) {
  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: await initialMessagePrompt.format({
      languageToLearn: conversation.language,
      languageLevel: conversation.level,
      nativeLanguage: conversation.native,
      topic: conversation.topic,
      characterName: conversation.character?.name,
      charcaterPersonality: conversation.character?.personality,
      learning_style: getLearningStyle(conversation.style as string),
    }),
  };

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [propmptMessage].map((m) => ({
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

export async function getAnswer(
  messages: Message[],
  conversation: Conversation
) {
  if (!messages || messages?.length === 0) {
    return;
  }

  const preparedMessages = messages.map((m) => ({
    role: m.role as ChatCompletionRequestMessageRoleEnum,
    content: m.text,
  }));

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: await responsePrompt.format({
      languageToLearn: conversation.language,
      languageLevel: conversation.level,
      nativeLanguage: conversation.native,
      topic: conversation.topic,
      characterName: conversation.character?.name,
      charcaterPersonality: conversation.character?.personality,
      learning_style: getLearningStyle(conversation.style as string),
    }),
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

export async function getFeedback(
  message: Message,
  conversation: Conversation
) {
  if (!message) {
    return;
  }

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: await feedbackPrompt.format({
      languageToLearn: conversation.language,
      languageLevel: conversation.level,
      nativeLanguage: conversation.native,
      topic: conversation.topic,
      characterName: conversation.character?.name,
      charcaterPersonality: conversation.character?.personality,
      learning_style: getLearningStyle(conversation.style as string),
      message_text: message.text,
    }),
  };

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [propmptMessage].map((m) => ({
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

export async function getExplanation(
  message: Message,
  conversation: Conversation,
  text: string
) {
  if (!message) {
    return;
  }

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: await explanationPrompt.format({
      languageToLearn: conversation.language,
      languageLevel: conversation.level,
      nativeLanguage: conversation.native,
      topic: conversation.topic,
      characterName: conversation.character?.name,
      charcaterPersonality: conversation.character?.personality,
      learning_style: getLearningStyle(conversation.style as string),
      message_text: message.text,
      text,
    }),
  };

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [propmptMessage].map((m) => ({
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

export async function getCardExplanation(
  message: Message,
  conversation: Conversation,
  text: string
) {
  if (!message) {
    return;
  }

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: await cardExplanationPrompt.format({
      languageToLearn: conversation.language,
      languageLevel: conversation.level,
      nativeLanguage: conversation.native,
      topic: conversation.topic,
      characterName: conversation.character?.name,
      charcaterPersonality: conversation.character?.personality,
      learning_style: getLearningStyle(conversation.style as string),
      message_text: message.text,
      text,
    }),
  };

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [propmptMessage].map((m) => ({
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

export async function regenerateAnswer(
  messages: Message[],
  conversation: Conversation
) {
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

    content: await regeneratePrompt.format({
      languageToLearn: conversation.language,
      languageLevel: conversation.level,
      nativeLanguage: conversation.native,
      topic: conversation.topic,
      characterName: conversation.character?.name,
      charcaterPersonality: conversation.character?.personality,
      learning_style: getLearningStyle(conversation.style as string),
      message_text: lastMessage.text,
    }),
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
