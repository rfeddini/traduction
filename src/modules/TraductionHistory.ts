import { Request, Response, Router } from "express";
import { mapUsers, mapTraductionHistory } from "../index";
const TraductionHistory = Router();
import jwt, { Secret } from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey: Secret = process.env.SECRET_KEY || "secret";

//function for decoding token into an email
function decodeToken(token: string) {
  const decodedToken = jwt.verify(token, secretKey) as JwtPayload; // => { email: 'ziri@gmail.com', iat: 1681657479 }
  return decodedToken.email;
}

// middleware
TraductionHistory.use((req: Request, res: Response, next) => {
  if (typeof req.headers.auth_key !== "string") {
    return res.status(400).send("auth_header should be a string");
  }
  // verifies if the user is connected
  const user = mapUsers.get(decodeToken(req.headers.auth_key));
  if (user) {
    return next();
  }
  return res.status(401).send("unauthorized");
});


//history router
TraductionHistory.get("/history", async (req: Request, res: Response) => {
  try {
    const email = decodeToken(req.headers.auth_key as string);
    const history = mapTraductionHistory.get(email);

    return res.status(200).send(history);
  } catch (error) {
    return res.status(400).send("something is wrong");
  }
});
export default TraductionHistory;
