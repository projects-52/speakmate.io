import { prisma } from './prisma.service';

export async function createMessage(
  conversationId: string,
  text: string,
  role: string
) {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        text,
        role,
      },
    });

    return message;
  } catch (error) {
    console.error('ERROR CREATING MESSAGE', error);
    return null;
  }
}

export async function getAllMessagesForConversation(conversationId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
    });

    return messages;
  } catch (error) {
    console.error('ERROR GETTING MESSAGES FOR CONVERSATION', error);
    return [];
  }
}

// function to get all the messages ordered by date desc for a conversation
export async function getAllMessagesForConversationOrderedByDate(
  conversationId: string
) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  } catch (error) {
    console.error('ERROR GETTING MESSAGES FOR CONVERSATION', error);
    return [];
  }
}

export async function getMessageById(id: string) {
  try {
    return await prisma.message.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error('ERROR GETTING MESSAGE BY ID', error);
    return null;
  }
}
