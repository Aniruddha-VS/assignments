import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createPostInput, updatePostInput } from "@asurse/common-app"; }
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

app.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const user = await prisma.users.findUnique({
    where: {
      id: c.get("id"),
    },
  });

  const data = await c.req.json();

  const {success} = createPostInput.safeParse(data)
  if (!success) {
    c.status(400);
    return c.json({error: "invalid input"})
  }


  const post = await prisma.post.create({
    data: {
      title: data.title,
      description: data.description,
      createdAt: new Date(),
      authorId: user?.id,
    },
  });

  return c.json({
    postId: post.id,
  });
});

app.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany({});

  console.log(posts);

  return c.json(JSON.stringify(posts));
});

app.get("/:id", async (c) => {
  const postId = Number(c.req.param("id"));

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  console.log(post);

  return c.json(post);
});

app.put("/:id", async (c) => {
  const postId = Number(c.req.param("id"));

  const body = await c.req.json();
  const {success} = updatePostInput.safeParse(body)
  if (!success) {
    c.status(400);
    return c.json({error: "invalid input"})
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: body,
    });
    return c.json({
      msg: "Update Successfull",
    });
  } catch (e) {
    return c.json({
      msg: "Update Failed",
    });
  }
});

app.delete("/:id", async (c) => {
  const postId = Number(c.req.param("id"));

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return c.json({
      msg: "Post deleted successfully",
    });
  } catch (e) {
    return c.json({
      msg: "Delete Failed",
    });
  }
});

export default app;
