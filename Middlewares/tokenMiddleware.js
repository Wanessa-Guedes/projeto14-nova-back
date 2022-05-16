import db from "../db.js";

export default async function validateToken(req, res, next){
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.status(404).send("Sessão finalizada, favor fazer o login novamente");

        const user = await db.collection("users").findOne({_id: session.userId});
        if(!user) return res.status(404).send("Usuário não encontrado, favor fazer o login novamente");

        res.locals.user = user;
    } catch (e) {
        return res.sendStatus(500);
    }
    next();
}