import db from "../db.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import { stripHtml } from "string-strip-html";
import chalk from "chalk";


//TODO: put atualização de endereço
//TODO: post dados de compra
//TODO: get alguns dados do comprador
//TODO: put dos dados do comprador
//TODO: get dos dados do carrinho
//TODO: post dos dados do pedido finalizado no banco de dados order

export async function getAddress(req,res){
    //TODO: get endereço... -> acessar banco de dados users pegar cep, street, number, complement, district, city, state
    
    try {
        const {authorization} = req.headers;
        const token = authorization?.replace("Bearer","").trim();
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.status(404).send("Sessão finalizada, favor fazer o login novamente");
        const user = await db.collection("users").findOne({_id: session.userId});
        if(!user) return res.status(404).send("Usuário não encontrado, favor fazer o login novamente");
        let addressInfo = {
                name: user.name,
                email: user.email,
                cep: user.cep,
                street :user.street,
                number: user.number,
                complement: user.complement,
                district: user.district,
                city: user.city,
                state: user.state};
        res.status(200).send(addressInfo);

    } catch (e) {
        res.status(500).send("Erro na página.");
}
}
