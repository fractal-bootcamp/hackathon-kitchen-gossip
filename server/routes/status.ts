// status check

export function mount(app) {
  app.get("/status", async (req, res) => {
    const status = {
      status: "ok",
      timestamp: new Date().toISOString(),
    }
    console.log("STATUS called")
    res.json({ message: "status", status })
  })
}
