import db from "../db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import Joi from "joi";
import { stripHtml } from "string-strip-html";
import chalk from "chalk";
import { v4 } from 'uuid';

export async function putLogOut(req, res){

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    const sessions = await db.collection("sessions").findOne({token});
    const user = await db.collection("users").findOne({_id: sessions.userId});

    await db.collection("sessions").updateOne({_id: new ObjectId(user._id)}, {$set:{token:""}});
    res.status(200).send("Sessão finalizada!");
}