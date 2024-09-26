import prisma from "./prisma";

// Get user by email
export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};
export const checkExistsEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: false,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

// Create User in Database
export const createUser = async (
  email: string,
  password: string,
  verificationCode: string
) => {
  const user = await prisma.user.create({
    data: {
      email,
      password,
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  return user;
};
