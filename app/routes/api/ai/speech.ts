import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { Response } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { createMessage } from '~/services/message.service';
import { transcribeAudio } from '~/services/openai.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('audio');
  const conversationId = formData.get('conversationId') as string;

  if (!(file instanceof File)) {
    throw new Error('File not found');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const response = await transcribeAudio(buffer, file);

  if (!response || !response.text || !response.text.length) {
    return null;
  }

  const message = await createMessage(conversationId, response.text, 'user');

  return json(message);
};
