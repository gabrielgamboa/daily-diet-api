import { app } from "./app";
import { env } from "./env";

app.listen(
  {
    port: env.PORT,
  },
  () => console.log(`HTTP Server running on port ${env.PORT}`),
);
