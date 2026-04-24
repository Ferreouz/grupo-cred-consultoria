import argon2 from "argon2";

export async function hashPassword(password: string) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    throw err;
  }
}

export async function passwordMatches(password: string, hash: string) {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    throw err;
  }
}
