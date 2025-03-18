import { app } from "./app"

const port : number = Number(Bun.env.PORT)
app.listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

