import { Hono } from "hono";
import { decode, verify } from "hono/jwt";
import { Bindings } from "hono/types";
import { JWT_SECRET } from "../config";

const authmiddleware = new Hono<{ Bindings: Bindings }>();

authmiddleware.use("/", async (c, next) => {
  if (c.req.method !== "GET") {
    const token = c.req.header("authorization")?.split("Bearer ")[1];

    if (!token) {
      return c.json({
        msg: "Auth token not provided",
      });
    }

    try {
      const decodedPayload = await verify(token, JWT_SECRET);
      console.log(decodedPayload);
      c.set("id", decodedPayload.id);
      await next();
    } catch (err) {
      return c.json({
        msg: "JWT token verification falied.",
      });
    }
  } else {
    await next();
  }
});

export default authmiddleware;
