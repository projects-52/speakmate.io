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

export async function getResponse(
  messages: ChatCompletionRequestMessage[]
): Promise<string | null> {
  console.log(messages);
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 1000,
    });

    const { data } = response;

    return data.choices[0].message?.content ?? null;
  } catch (error) {
    return null;
  }
}

export async function getInitialMesage(conversation: Partial<Conversation>) {
  console.time('getInitialMesage');
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

  const response = await getResponse(
    [propmptMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getInitialMesage');
  console.log('getInitialMesage length', response?.length);
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

  const response = await getResponse(
    [propmptMessage, ...preparedMessages].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getAnswer');
  console.log('getAnswer length', response?.length);
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

  const response = await getResponse(
    [propmptMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getFeedback');
  console.log('getFeedback length', response?.length);
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

  const response = await getResponse(
    [
      propmptMessage,
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: `
        Can you please explain what does "${text}" mean in the context of this message: "${message.text}"
        Keep your response clear and short
        Answer with JSON following the format:

        {
          original: "${text}},
          transcription:
            <${text} transcribed according to the rules of the phonetic transcription in the ${conversation.language}',
          translation:
            <${text} translated to the user's native language>,
          explanation:
            <Explanation of the meaning, considering context of the message. Depends on the level, you should use either native language or the one user learns. Make sure, that you use only one of those languages>,
        }
      `,
      },
    ].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getExplanation');
  console.log('getExplanation length', response?.length);
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

  const response = await getResponse(
    [propmptMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );
  console.timeEnd('getCardExplanation');
  console.log('getCardExplanation length', response?.length);
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

  const response = await getResponse(
    [propmptMessage, ...preparedMessages].map((m) => ({
      role: m.role,
      content: m.content,
    }))
  );

  console.timeEnd('regenerateAnswer');
  console.log('regenerateAnswer length', response?.length);
  return response;
}
