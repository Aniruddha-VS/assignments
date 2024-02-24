import { Hono } from "hono";
import users from "./routes/users";
import authmiddleware from "./middleware";
import posts from "./routes/posts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono! Aniruddha this side");
});

app.route("/users", users);
app.route("/posts", authmiddleware);
app.route("/posts", posts);

app.notFound((c) => {
  return c.text("Ham pe tooh he hi noo.");
});

export default app;
