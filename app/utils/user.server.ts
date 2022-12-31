import bcrypt from "bcryptjs";
import type { RegisterForm } from "./types.server";
import { prisma } from "./prisma.server";
import type { Profile } from "@prisma/client";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  });
  return { id: newUser.id, email: user.email };
};

export const updateUser = async (userId: string, profile: Partial<Profile>) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profile: {
        update: profile,
      },
    },
  });
};

/* Note: You were able to fill in the details of the 
  profile embedded document directly in this query by 
  passing in a JSON object, 
  and you will see some nice autocompletion 
  because of the typings Prisma generates.
  https://www.prisma.io/blog/fullstack-remix-prisma-mongodb-2-ZTmOy58p4re8
   */

export const getOtherUsers = async (userId: string) => {
  return prisma.user.findMany({
    where: {
      id: { not: userId },
    },
    orderBy: {
      profile: {
        firstName: "asc",
      },
    },
  });
};

/* export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      profile: {
        firstName: "asc",
      },
    },
  });
};
 */
export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};
