import fastify from "fastify"
import fastifyCors from "@fastify/cors"
import * as dotenv from "dotenv"
import definedRoutes from "./routes"

const app = async () => {
  dotenv.config()

  const server = await fastify({
    logger: process.env.NODE_ENV === "development",
    connectionTimeout: 20,
  })

  // CORS stuff
  server.register(fastifyCors, {
    origin: process.env.ORIGIN_PRODUCTION_URL || "http://localhost:3000",
    methods: "GET"
  })

  // Entry point
  server.register(definedRoutes, { prefix: "/api" })

  server.listen(
    {
      port: Number(process.env.SERVER_PORT) || 4000,
      host: process.env.SERVER_HOST || "localhost"
    },
    (err, addr) => {
      if (err) {
        console.error(`There's an oopsie:`, err)
        process.exit(1)
      }

      console.log(`Server now listening on ${addr}!`)
    })
}

app()