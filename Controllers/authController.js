import db from "./../db.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import { stripHtml } from "string-strip-html";
import chalk from "chalk";
import { v4 } from 'uuid';

export async function postSignUp(req, res){

    const dataToValidate = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm: req.body.confirm,
    };

    const signUpSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        confirm: Joi.ref('password'), 
    });

    const {error, value} = signUpSchema.validate(dataToValidate,  {abortEarly: false});
    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    };
    console.log(value)
    const passowrdHash = bcrypt.hashSync(req.body.password, 10);
    const sanitizedName = stripHtml(req.body.name).result.trim();

    try {

        const usersCollection = db.collection("users");
        const infosUser = {
            name: sanitizedName,
            email: value.email,
            password: passowrdHash,
            cep: req.body.cep, 
            street: req.body.street, 
            number: req.body.number,
            complement: req.body.complement,
            district: req.body.district, 
            city: req.body.city, 
            state: req.body.state
        }
        const emailExist = await usersCollection.findOne({email: infosUser.email});
        if(emailExist){
            return res.status(409).send(chalk.bold.red("E-mail já cadastrado."));
        }

        //criando uma coleção de carrinho para o usuário.
        await db.collection("cart").insertOne({email: infosUser.email, cart:[]});

        await usersCollection.insertOne(infosUser);
        console.log(infosUser);
        res.status(201).send(console.log(chalk.bold.green("Cadastro realizado com sucesso")));

    } catch (e) {
        res.status(500).send(console.log("Erro ao cadastrar", e));
    }

}

export async function postSignIn(req, res){

    const signInSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const {error, value} = signInSchema.validate(req.body, {abortEarly: false});
    if(error){
        return res.status(422).send(`Dados preenchidos incorretamente. !! Senha tem no min 3 caracteres.`);
    };

    try {
        const userCollection = db.collection("users");
        const logInInfo = {
            email: value.email,
            password: value.password
        };
        const isUser = await userCollection.findOne({email: logInInfo.email});
        if(isUser && bcrypt.compareSync(logInInfo.password, isUser.password)){
            const token = v4();
            await db.collection("sessions").insertOne({
                userId: isUser._id,
                token
            });
            return res.status(200).send({name: isUser.name, token});
        } else {
            return res.status(401).send("Falha no log-in. Usuário não cadastrado ou senha inválida.");
        }

    } catch (e) {
        res.status(500).send("Erro ao logar");
    }

}