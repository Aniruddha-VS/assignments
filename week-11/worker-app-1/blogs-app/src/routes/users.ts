import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
import { sign } from "hono/jwt";
import { JWT_SECRET } from "../../config";
import { signinInput, signupInput, SigninType } from "@asurse/common-app";}
import { deleteCookie, setSignedCookie } from "hono/cookie";

const COOKIE_NAME = "blogs-app";
const app = new Hono();

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

app.post("/signup", async (c) => {
  const body:  {
    username: string;
    email: string;
    password: string;
  } = await c.req.json();

  const { success } = signupInput.safeParse(body)

  if (!success) {
    c.status(400);
    return c.json({error: "invalid input"})
  }

  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  console.log(DATABASE_URL);

  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  const salt = await generateSalt(16);

  const hash = await hashPassword(body.password, salt);

  const exixtingUser = await prisma.users.findFirst({
    where: {
      OR: [
        {
          email: body.email,
        },
        {
          username: body.username,
        },
      ],
    },
  });

  if (exixtingUser) {
    return c.json({
      msg: "Username / Email already taken",
    });
  }

  try {
    const newUser = await prisma.users.create({
      data: {
        username: body.username,
        password: hash,
        email: body.email,
        salt: salt,
      },
    });
    const payload = {
      id: newUser.id,
    };
    const cookieData = await sign(payload, JWT_SECRET);

    c.header("Authorization", "Bearer " + cookieData);

    // await setSignedCookie(c, COOKIE_NAME, cookieData, JWT_SECRET, {
    //   path: "/",
    //   secure: true,
    //   httpOnly: true,
    //   maxAge: 1000,
    //   domain: "localhost",
    //   sameSite: "Strict",
    // });
  } catch (e) {
    c.status(503);
    return c.json({
      msg: "Could not create user. DB issue.",
    });
  }
  return c.json({
    msg: "User successfully created.",
  });
});

app.post("/signin", async (c) => {
  const body: {
    email: string;
    password: string;
  } = await c.req.json();

  const { success } = signinInput.safeParse(body)

  if (!success) {
    c.status(400);
    return c.json({error: "invalid input"})
  }


  console.log("Body", body);

  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  const existingUser = await prisma.users.findUnique({
    where: {
      email: body.email,
    },
  });

  console.log("Found existing user..", existingUser);

  if (!existingUser) {
    return c.json({
      msg: "User not found",
    });
  }

  const salt = existingUser.salt;

  const inputHashPassword = await hashPassword(body.password, salt);

  if (inputHashPassword == existingUser.password) {
    const payload = {
      id: existingUser.id,
    };
    const cookieData = await sign(payload, JWT_SECRET);

    c.header("Authorization", "Bearer " + cookieData);

    // await setSignedCookie(c, COOKIE_NAME, cookieData, JWT_SECRET, {
    //   path: "/",
    //   secure: true,
    //   httpOnly: true,
    //   maxAge: 1000,
    //   domain: "localhost",
    //   sameSite: "Strict",
    // });

    return c.json({
      msg: "User verified.",
    });
  } else {
    return c.json({
      msg: " Invalid Password.",
    });
  }
});

app.post("/logout", async (c) => {
  c.header("Authorization", "");
  // deleteCookie(c, COOKIE_NAME, {
  //   path: "/",
  //   secure: true,
  //   domain: "localhost",
  // });
  return c.redirect("/");
});

export default app;
