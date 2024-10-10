import fastify from "fastify"
import fastifyCors from "@fastify/cors"
import routes from "./routes"
import * as dotenv from "dotenv"

const app = async () => {
  dotenv.config()

  const server = await fastify({
    logger: process.env.NODE_ENV === "development",
    connectionTimeout: 20,
  })

  server.register(fastifyCors, {
    origin: process.env.ORIGIN_PRODUCTION_URL || "http://localhost:3000",
  })

  server.addHook("onSend", (req, reply, payload, done) => {
    reply.header("Access-Control-Allow-Headers", "Accept,Origin,Content-Type")
    reply.header("Access-Control-Allow-Methods", "GET")
    done()
  })

  server.get("/", routes.root)
  server.get("/video/:id", routes.video)

  server.get("/uuid/:uuid", routes.uuid)

  server.get("/userid/:userid", routes.uuid)
  server.get("/username/:username", routes.uuid)
  server.get("/vip-users", routes.vipUsers)

  // Entry point
  server.listen(
    {
      port: Number(process.env.SERVER_PORT) || 4000,
      host: process.env.SERVER_HOST || "localhost"
    },
    (err, addr) => {
      if (err) {
        server.log.error(`There's an oopsie:`, err)
        process.exit(1)
      }

      server.log.info(`Server now listening on ${addr}!`)
    })
}

app()