import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
