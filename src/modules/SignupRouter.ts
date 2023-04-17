import { Request, Response, Router } from "express";
import dotenv from "dotenv";
import { mapUsers, salt } from "../index";
import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

dotenv.config();
const signupRouter = Router();


const secretKey: Secret = process.env.SECRET_KEY || "secret";

function isEmail(email: string) {
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return emailFormat.test(email);
}



signupRouter.get("/signup", (req: Request, res: Response) => {
  res.send("test");
});
signupRouter.post("/signup", (req: Request, res: Response) => {
  if (isEmail(req.body.email)) {
    //verifies if the email is valid with regex
    const userExist = mapUsers.has(req.body.email)
    if (!userExist) {
      //verifies if email exist in map
      if (req.body.password.length >= 16) {
        //verifies if the password is more than 16 caractere

        const passHash = bcrypt.hashSync(req.body.password, salt); //password hashing

        const userToken = jwt.sign({ email: req.body.email }, secretKey); //token

        const user = {
          email: req.body.email,
          password: passHash,
          firstName: req.body.first_name,
          lastName: req.body.last_name,
        };
        mapUsers.set(req.body.email, user);

        return res.status(200).send({
          ...user,
          userToken,
        });
      }
      return res.status(400).send("password will be more than 16 caractere");
    }
    return res.status(400).send("already exist !!! yo");
  }
  return res.status(400).send("email is incorrect !!!!");
});

export default signupRouter;


