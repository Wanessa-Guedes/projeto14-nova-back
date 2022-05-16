import db from "./../db.js";

export async function postItem(req, res){
    const {user} = res.locals;
    const product = req.body;
    if(product.length === 0) return res.status(422).send("a lista de compras está vazia!")

    try {
        await db.collection("cart").updateOne({user: user.email}, {$push:{cart: [product]}});
        res.status(200).send("recebendo lista");
        
    } catch (e) {
        console.log("erro ao cadastrar lista", e);
        res.status(500).send(e);
    }
}

export async function getCartItens(req, res){
    const {user} = res.locals;
    console.log(user);
    try {
        const userCart = await db.collection("cart").findOne({user: user.email});
        console.log(userCart);
        if(!userCart) return res.status(404).send("Lista de compras não encontrada");
        console.log(4);
        res.status(200).send(userCart);
    } catch (e) {
        console.log("erro ao buscar lista", e);
        res.status(500).send(e);
    }
}

export async function deleteItem(req, res){
    const {user} = res.locals;
    const {id} = req.params;

    console.log(1);
    
    try {
        console.log(2);

        const userCart = await db.collection("cart").findOne({user: user.email});
        console.log(3);
        if(!userCart) return res.status(404).send("Lista de compras não encontrada");

        const newCart = userCart.cart.filter((elemento) => elemento._id !== id);
        console.log("nova lista", newCart);
        await db.collection("cart").updateOne({user: user.email}, {$set:{cart:newCart}});
        
        res.status(200).send(newCart);
        
    } catch (e) {
        console.log("erro ao buscar lista", e);
        res.status(500).send(e);
    }
}
