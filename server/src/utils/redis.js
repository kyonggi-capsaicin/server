import { createClient } from "redis";

let client;

if (process.env.NODE_ENV === "dev") {
  (async () => {
    client = createClient();

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();
  })();
} else {
  (async () => {
    client = createClient({
      host: "redis-server",
      port: process.env.REDIS_PORT_PRO,
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();
  })();
}

export default client;
