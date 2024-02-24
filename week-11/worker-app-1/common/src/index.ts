import { z } from "zod";

export const signupInput = z.object({
  username: z.string(),
  password: z.string().min(6),
  email: z.string().email(),
});

export type SignupType = z.infer<typeof signupInput>;

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SigninType = z.infer<typeof signinInput>;

export const createPostInput = z.object({
  title: z.string(),
  description: z.string(),
});

export type CreatePostType = z.infer<typeof createPostInput>;

export const updatePostInput = createPostInput.partial();

export type UpdatePostInput = z.infer<typeof updatePostInput>;
