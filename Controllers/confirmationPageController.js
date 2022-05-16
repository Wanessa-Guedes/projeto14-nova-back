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
                street: user.street,
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

export async function postOrder(req,res){
    //TODO: Criar collection de pedido final com as infos da página

    const dataToValidate = {
        cep: req.body.cep,
        street: req.body.street,
        number: req.body.number,
        complement: req.body.complement,
        district: req.body.district,
        city: req.body.city,
        state: req.body.state,
        creditcard: req.body.creditcard,
        cvv: req.body.cvv,
        validate: req.body.validate,
        cpfTitular: req.body.cpfTitular,
    }

    const signUpSchema = Joi.object({
        cep: Joi.string().pattern(new RegExp('^[0-9]{5}\-[0-9]{3}$')).required(),
        street: Joi.string().required(),
        number: Joi.number().required(),
        complement: Joi.string().required(),
        district: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        creditcard: Joi.string().pattern(new RegExp('^[0-9]{16}$')).required(),
        cvv: Joi.string().pattern(new RegExp('^[0-9]{3}$')).required(),
        validate: Joi.string().pattern(new RegExp('^[0-9]{1}[1-9]{1}\/[2-9]{2}$')).required(),
        cpfTitular: Joi.string().pattern(new RegExp('^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$')) 
    });

    const {error, value} = signUpSchema.validate(dataToValidate,  {abortEarly: false});
    if(error){
        return res.status(422).send(error.details.map(detail => console.log(detail.message)));
    };

    const order = req.body;
    try {
        await db.collection("order").insertOne(order);
        res.sendStatus(201);

    } catch (e) {
        console.log("Erro ao receber pedido final", e);
        res.status(500).send(e);
    }
}
