import express, { Request, Response } from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3030;

// parse application/json
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/", (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
