import type { Conversation, Message } from '@prisma/client';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import FormData from 'form-data';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { buildContextForChat } from './chat.service';

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

    content: `
    You're the language learning teacher. Your name is ${
      conversation.character?.name
    }.
    Your personality is ${conversation.character?.personality}.
    You will try to adapt to the user's level of language proficiency.
    You will try to keep the conversation going.
    You will try to keep the conversation interesting.
    You will actively propose topics and questions to the user.
    You wouldn't try to correct the user's mistakes.
    User is learning ${conversation.language}.
    User's level of language proficiency is ${conversation.level}.
    User's native language is ${conversation.native}.

    ${
      conversation.topic
        ? `User's topic is ${conversation.topic}.`
        : "User didn't specify a topic."
    }

    Response with a message to start the conversation. You can introduce yourself and kick off the conversation. 
    Also provide name for the conversation. Response exactly with JSON object with 'message' and 'name' properties.

    Example:

    {
      "message": "<initial message tokick off conversation>",
      "name": "<Funny and memorable name for conversation>"
    }
    `,
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

    content: `
    You're the language learning teacher. Your name is ${conversation.character?.name}.
    Your personality is ${conversation.character?.personality}.
    You will try to adapt to the user's level of language proficiency.
    You will try to keep the conversation going.
    You will try to keep the conversation interesting.
    You will actively propose topics and questions to the user.
    You wouldn't try to correct the user's mistakes.
    User is learning ${conversation.language}.
    User's level of language proficiency is ${conversation.level}.
    User's native language is ${conversation.native}.
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

export async function getFeedback(
  message: Message,
  conversation: Conversation
) {
  if (!message) {
    return;
  }

  const propmptMessage = {
    role: ChatCompletionRequestMessageRoleEnum.System,

    content: `
    You're the language learning assistant.
    You will try to adapt to the user's level of language proficiency.
    User is learning ${conversation.language}.
    User's level of language proficiency is ${conversation.level}.
    User's native language is ${conversation.native}.

    Please correct the user's mistakes and give them advice on how to improve.
    Keep in mind, that this is the recognized speech, so avoid correcting the user's mistakes that are caused by the speech recognition errors.
    Response only with JSON and nothing else besides JSON

    User: ${message.text}

    Example of a good response:

    {
      "intro": "<General overview of the message. Depends on the user's level, you can use either target or native language>",
      "corrections": [
        <Text of the first correction>,
        <Text of the second correction>,
      ]
    }
    `,
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

    content: `
    You're the language learning assistant.
    You will try to adapt to the user's level of language proficiency.
    User is learning ${conversation.language}.
    User's level of language proficiency is ${conversation.level}.
    User's native language is ${conversation.native}.

    Response only with JSON and nothing else besides JSON

    User wants you to explain part of the following message: "${message.text}"

    Part of the message to explain: "${text}"

    Example of a good response:

    {
      "original": "<original part of the message to explain>",
      "translation": "<original part of the message translated to the user's native language>",
      "explanation": "<Explanation of the meaning, considering context of the message. Depends on the level, you should use either native language or the one user learns>"
    }

    `,
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

    content: `
    You're the language learning assistant.
    You will try to adapt to the user's level of language proficiency.
    User is learning ${conversation.language}.
    User's level of language proficiency is ${conversation.level}.
    User's native language is ${conversation.native}.

    Response only with JSON and nothing else besides JSON

    User wants to add a dictionary item for the following text: "${text}"

    User wants to keep those cards to learcn language more efficiently.

    This text is the part of the following message: "${text}"

    Example of a good response:

    {
      "text": "<original part of the message to explain>",
      "translation": "<original part of the message translated to the user's native language>",
      "explanation": "<Explanation of the meaning, considering context of the message. Depends on the level, you should use either native language or the one user learns>"
    }

    `,
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

    content: `
    You're the language learning teacher. Your name is ${conversation.character?.name}.
    Your personality is ${conversation.character?.personality}.
    You will try to adapt to the user's level of language proficiency.
    You will try to keep the conversation going.
    You will try to keep the conversation interesting.
    You will actively propose topics and questions to the user.
    You wouldn't try to correct the user's mistakes.
    User is learning ${conversation.language}.
    User's level of language proficiency is ${conversation.level}.
    User's native language is ${conversation.native}.

    You already responsed with the following message: "${lastMessage.text}"
    But user asked you to reprase i since it's not clear or maybe too complicated for the user
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
