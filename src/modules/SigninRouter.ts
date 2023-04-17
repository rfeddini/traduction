import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import { mapUsers } from "../index";
import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
dotenv.config();

const signinRouter = Router();
signinRouter.use(express.json());
const secretKey: Secret = process.env.SECRET_KEY || "secret";
signinRouter.post("/signin", (req: Request, res: Response) => {
  try {
    const user = mapUsers.get(req.body.email);

    if (user) {
      const rightPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (rightPassword) {
        //compare the passwords
        const userToken = jwt.sign({ email: user.email }, secretKey); //token
        return res.send(userToken);
      }
      return res.status(404).send("wrong password !!!!");
    }
    return res.status(404).send("bad user");
  } catch (e) {
    return res.status(404).send(e);
  }
});

export default signinRouter;

