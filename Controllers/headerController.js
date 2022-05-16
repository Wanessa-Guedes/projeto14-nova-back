import db from "../db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import Joi from "joi";
import { stripHtml } from "string-strip-html";
import chalk from "chalk";
import { v4 } from 'uuid';

export async function deleteLogOut(req, res){

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.status(401).send("Verifique se você estava logado.");

    const sessions = await db.collection("sessions").findOne({token});
    const user = await db.collection("users").findOne({_id: ObjectId(sessions.userId)});

    await db.collection("sessions").deleteOne({token});
    res.status(200).send("Sessão finalizada!");
}