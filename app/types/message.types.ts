import type { Explanation, Feedback, Message } from '@prisma/client';

export type UIMessage =
  | (Message & {
      explanations: Explanation[];
      feedbacks: Feedback[];
    })
  | {
      id: string;
      role: 'loading';
      createdAt: string;
    };
