import { Request, Response, Router } from "express";
import { mapUsers, mapTraduction, mapTraductionHistory } from "../index";
const TraductionRouter = Router();
import axios from "axios";
import jwt, { Secret } from "jsonwebtoken";
import { Traduction } from "./types";
import dotenv from "dotenv";
import { JwtPayload } from "jsonwebtoken";
dotenv.config();

const secretKey: Secret = process.env.SECRET_KEY || "secret";


//function decode token to get an email
function decodeToken(token: string) {
  const decodedToken = jwt.verify(token, secretKey) as JwtPayload; // => { email: 'ziri@gmail.com', iat: 1681657479 }
  return decodedToken.email;
}




// middleware
TraductionRouter.use((req: Request, res: Response, next) => {
  if (typeof req.headers.auth_key !== "string") {
    return res.status(400).send("auth_header should be a string");
  }
  // verify if user exists
  const user = mapUsers.get(decodeToken(req.headers.auth_key));
  if (user) {
    return next();
  }
  return res.status(401).send("unauthorized");
});





//translator router
TraductionRouter.get("/translator", async (req: Request, res: Response) => {
  const trasnlationKey = req.body.text + req.body.target_lang;
  
  //i////f (req.body.target_lang is a proper language iSO2

  let translationResult = null;

//check if the traduction already exists in the map
const tradcutionExist: boolean = mapTraduction.has(trasnlationKey);
  if (tradcutionExist) {
    const tradcution = mapTraduction.get(trasnlationKey);
    translationResult = tradcution;
  }
//traduction API call
  if (!translationResult) {
    try {
      const result = await axios({
        method: "get",
        url: "https://api-free.deepl.com/v2/translate",
        headers: {
          Authorization: process.env.API_KEY,
        },
        data: {
          text: [req.body.text],
          target_lang: req.body.target_lang,
        },
      });

      translationResult = result.data;
      // add the new traduction to the map
      mapTraduction.set(trasnlationKey, translationResult);
    } catch (error) {
      return res.status(404).send("Something is wrong");
    }
  }

  const email = decodeToken(req.headers.auth_key as string);
//check if the current email have a history in mapTraductionhistory
  if (!mapTraductionHistory.has(email)) {
    mapTraductionHistory.set(email, [translationResult]);
  } else {
    let traductionArray = mapTraductionHistory.get(email) as Traduction[];
    traductionArray.push(translationResult);
    mapTraductionHistory.set(email, traductionArray);
  }

  return res.status(200).send(translationResult);
});
export default TraductionRouter;



