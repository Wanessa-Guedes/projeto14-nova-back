import db from "./../db.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import { stripHtml } from "string-strip-html";
import chalk from "chalk";
import { v4 } from 'uuid';

//TODO: Tela cadastro --> Infos: nome, email, endereço, senha
// endereço: cep, logradouro, complemento, bairro, localidade, UF
// Receber um get do cep viacep no front e colocar num objeto e passar para cá

export async function postSignUp(req, res){
    // endereço vou receber de outra api
    // validar o que recebo dessa

    const dataToValidate = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm: req.body.confirm,
    };

    console.log(dataToValidate)

    const signUpSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        confirm: Joi.ref('password'), 
    });

    const {error, value} = signUpSchema.validate(dataToValidate,  {abortEarly: false});
    if(error){
       // return res.status(422).send(`Dados preenchidos incorretamente. 
       //                             !! Senha precisa ter no min 3 caracteres.`);
        return res.status(422).send(error.details.map(detail => detail.message));
    };
    console.log(value)
    const passowrdHash = bcrypt.hashSync(req.body.password, 10);
    const sanitizedName = stripHtml(req.body.name).result.trim();

    try {
        //acessar o db de usuários
        //pegar os novos dados arrumados (senha criptografada e nome sanitizado)
        // conferir no db se esse email ainda não foi cadastrado
        // estando tudo certo adicionar na coleção usuários

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

        await usersCollection.insertOne(infosUser);
        console.log(infosUser);
        res.status(201).send(console.log(chalk.bold.green("Cadastro realizado com sucesso")));

    } catch (e) {
        res.status(500).send(console.log("Erro ao cadastrar", e));
    }

}

export async function postSignIn(req, res){
//TODO: post sign in: recebe e-mail e senha
// fazer um joi dos dados?
// confere se o e-mail está cadastrado no banco
// confere se a senha é a mesma cadastrada
// se sim, gerar uma sessão com o token e adicionar ao banco de dados

    // Verificação com joi
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