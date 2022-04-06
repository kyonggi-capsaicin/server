import { createClient } from "redis";

let client;
(async () => {
  client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
})();

export default client;
