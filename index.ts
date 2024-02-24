import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
const app = new Hono({ strict: false });

async function generateSalt(length: number): Promise<string> {
  const saltBytes = new Uint8Array(length);
  crypto.getRandomValues(saltBytes);
  return Array.from(saltBytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function checkPassword(
  password: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> {
  const hashedInputPassword = await hashPassword(password, salt);
  return hashedInputPassword === hashedPassword;
}

app.get("/", (c) => {
  return c.text("Hello Hono! Aniruddha this side");
});

app.post("/users/signup", async (c) => {
  const body: {
    username: string;
    email: string;
    password: string;
  } = await c.req.json();

  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  console.log(DATABASE_URL);

  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  const salt = await generateSalt(16);

  const hash = await hashPassword(body.password, salt);

  try {
    await prisma.users.create({
      data: {
        username: body.username,
        password: hash,
        email: body.email,
        salt: salt,
      },
    });
  } catch (e) {
    throw e;
  }

  return c.json({
    msg: "User successfully created.",
  });
});

app.notFound((c) => {
  return c.text("Ham pe tooh he hi noo.");
});
export default app;
