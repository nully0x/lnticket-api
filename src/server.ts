import express, { Express, Request, Response } from "express";
import config from "../src/config/config";
import { AuthRouter } from "./controllers/v0/users/routes/auth.router";
const bodyParser = require("body-parser");
const cors = require("cors");

const app: Express = express();
const port = config.port;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/auth", AuthRouter);

app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
