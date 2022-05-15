import db from "./../db.js";
import dayjs from "dayjs";

export async function postItem(req, res){
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    const product = req.body;
    console.log(product);
    if(product.length === 0) return res.status(422).send("a lista de compras está vazia!")

    try {
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.status(404).send("Sessão finalizada, favor fazer o login novamente");

        const user = await db.collection("users").findOne({_id: session.userId});
        if(!user) return res.status(404).send("Usuário não encontrado, favor fazer o login novamente");

        const userCart = await db.collection("cart").findOne({user: user.email});
        if(!userCart){
            const userCartList = await db.collection("cart").insertOne({
                buyList: [...product], 
                user: user.email,
                user_id: user._id,
                date: dayjs().format("DD/MM")});
            console.log("novo", userCartList);
        } else if(userCart){
            const userCartList = await db.collection("cart").updateOne({user: user.email}, {$set:{buyList: [...product]}                
            });

            console.log("up",userCartList);
        }
        res.status(200).send("recebendo lista");
        
    } catch (e) {
        console.log("erro ao cadastrar lista", e);
        res.status(500).send(e);
    }
}

export async function getCartItens(req, res){
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    try {
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.status(404).send("Sessão finalizada, favor fazer o login novamente");

        const user = await db.collection("users").findOne({_id: session.userId});
        if(!user) return res.status(404).send("Usuário não encontrado, favor fazer o login novamente");

        const userCart = await db.collection("cart").findOne({user: user.email}).toArray();
        if(!userCart) return res.status(404).send("Lista de compras não encontrada");
        
        res.status(200).send(userCart);
    } catch (error) {
        console.log("erro ao buscar lista", e);
        res.status(500).send("erro ao buscar lista", e);
    }
}

export async function deleteItem(req, res){
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    const product = req.body;
    if(product.length === 0) return res.status(422).send("a lista de compras está vazia!")

    try {
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.status(404).send("Sessão finalizada, favor fazer o login novamente");

        const user = await db.collection("users").findOne({_id: session.userId});
        if(!user) return res.status(404).send("Usuário não encontrado, favor fazer o login novamente");

        const userCart = await db.collection("cart").findOne({user: user.email}).toArray();
        if(!userCart) return res.status(404).send("Lista de compras não encontrada");

        console.log(userCart);
        res.send(200);

        // const deleteProduct = await db.collection("cart").delete({buyList: userCart.buyList.product.id})
        
    } catch (e) {
        console.log("erro ao buscar lista", e);
        res.status(500).send("erro ao buscar lista", e);
    }
}
