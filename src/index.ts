import dotenv from "dotenv";
dotenv.config()
const port = process.env.PORT;
import express, { Express, Request, Response } from "express";
import { Traduction, User } from "./modules/types";
import SigninRouter from "./modules/SigninRouter";
import SignupRouter from "./modules/SignupRouter";
import TraductionRouter from "./modules/TraductionRouter";
import TraductionHistory from "./modules/TraductionHistory";
import * as bcrypt from "bcrypt";

const saltRounds = 10;
export const salt: string = bcrypt.genSaltSync(saltRounds);
const app: Express = express();
export const mapUsers = new Map<string, User>();
export const mapTraduction = new Map<string, Traduction>();
export const mapTraductionHistory = new Map<string, Traduction[]>();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.sendStatus(200);
});

app.use(SignupRouter);
app.use(SigninRouter);
app.use(TraductionRouter);
app.use(TraductionHistory);


app.listen(port, () => {
  console.log("server launched  !!!");
});
