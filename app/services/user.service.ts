import { prisma } from './prisma.service';

type Profile = {
  email: string;
  picture: string;
};

export const findOrCreateAuthor = async (profile: Profile) => {
  const user = await prisma.user.findUnique({
    where: { email: profile.email },
  });
  if (user) {
    return user;
  }
  const newUser = await prisma.user.create({
    data: { email: profile.email, picture: profile.picture },
  });
  return newUser;
};
