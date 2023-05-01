import { prisma } from './prisma.service';

export async function getAllConversationsForUser(userId: string) {
  try {
    return await prisma.conversation.findMany({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getConversationById(id: string) {
  try {
    return await prisma.conversation.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

function getDateString() {
  const date = new Date();
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export async function createConversation(userId: string) {
  try {
    return await prisma.conversation.create({
      data: {
        userId,
        name: getDateString(),
      },
    });
  } catch (error) {
    console.error('ERROR CREATING CONVERSATION', error);
    return null;
  }
}
