import express from "express"
import cors from "cors"
import { mount } from "./routes/status"

export const PORT = 4101

const app = express()

app.use(express.json())
app.use(cors())

async function init() {
  app.get("/", async (req, res) => {
    console.log("GET endpoint called.")
    res.json({ message: "Hello from the server" })
  })

  // comment

  const storedValues: string[] = []

  app.post("/newmessage", async (req, res) => {
    console.log("POST endpoint called.")
    const newMessage = req.body.message
    storedValues.push(newMessage)
    res.json({ messages: storedValues })
  })

  mount(app)

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

init()
