// status check

import { getStatus } from "../services/github"

export function mount(app) {
  app.get("/api/status", async (req, res) => {
    const status = await getStatus()
    console.log("STATUS called")
    res.json({ message: "status", status })
  })
}
