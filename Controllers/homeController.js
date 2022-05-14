import db from "../db.js";

//estrutura do produto
// {
//     "name":"Rosa Flor",
//     "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJjjKmrUO7d8501i3sCGNeMtUP-C-sCgmsaw&usqp=CAU",
//     "description":"Cheirinho de rosas",
//     "amount":"5",
//     "price":"79.90",
//     "category":"floral"
// }

export async function registerProducts(req, res){
    const product = req.body;
    try {
        await db.collection("products").insertOne(product);
        res.status(201).send("produto cadastrado")

    } catch (error) {
        console.log("erro ao cadastrar produto", error);
        res.status(500).send(error);
    }
}

export async function getProducts(req, res){
    try {
        const products = await db.collection("products").find({}).toArray();
        res.status(200).send(products);

    } catch (error) {
        console.log("erro ao buscar produtos", error);
        res.status(500).send(error);
    }
}