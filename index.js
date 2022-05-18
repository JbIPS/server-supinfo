const fastify = require('fastify')({ logger: true })

const items = [{
        id: 1,
        name: 'Cartable',
        price: 4
}]

// Declare a route
fastify.get('/', async (request, reply) => {
        const qs = request.query;
        if (qs.from === 'jb') {
                return `Hello ${qs.from}: here's your secret!`;
        } else {
                reply.code(401).send('Unauthorized')
        }
})

fastify.get('/products', async (request, reply) => {
        return items;
})

fastify.get('/products/:id', async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const desiredItem = items.find((item) => item.id === id);
        if (desiredItem) {
                return desiredItem;
        } else {
                reply.code(404).send('not found');
        }
});

//- [] Corriger la route `PUT /products/:id` pour qu'elle remplace un produit existant//

fastify.put('/products/:id', async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const desiredItem = items.find((item) => item.id === id);
        const indexItem = items.findIndex((item) => item.id === id);


        if (!request.body.name || !request.body.price) {
                reply.code(400).send('Product must have a name and a price')
        } else {
                if(desiredItem){
                        items[indexItem] = {id: id, name: request.body.name, price: request.body.price}
                        return reply.code(201).send(`Product ${request.body.name} has been created`);
                }
                else{ 
                items.push({
                        id: id,
                        name: request.body.name,
                        price: request.body.price
                });
                return reply.code(201).send(`Product ${request.body.name} has been created`);
        }
        }
})

//- - [] Créer une route permettant de rajouter des produits sans donner d'ID (lui en attribuer un  sur le serveur)
//

fastify.post('/products/add', async (request, reply) => {

        if (!request.body.name || !request.body.price) {
                reply.code(400).send('Product must have a name and a price');
        } else {
                idToAdd = Math.max(...items.map(o => o.id));
                idToAdd +=1;
                console.log("test")
                items.push({
                        id: idToAdd,
                        name: request.body.name,
                        price: request.body.price
                });
                return reply.code(201).send(`Product ${request.body.name} has been created and the id wanted id  ${idToAdd}`);
        }
})


//- [] Créer une route permettant de supprimer un produit//

fastify.delete('/products/delete/:id', async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const desiredItem = items.find((item) => item.id === id);
        const indexItem = items.findIndex((item) => item.id === id);

                if(desiredItem){
                        items.splice(indexItem,1)
                        return reply.code(201).send(`Product that had for id:${id} has been deleted`);
                }
                else{ 
                        return reply.code(404).send(`not found`)
                
        }
})

//- [] Créer une route permettant de changer le prix d'un produit (sans l'écraser)//

fastify.patch('/products/patch/:id', async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const desiredItem = items.find((item) => item.id === id);
        const indexItem = items.findIndex((item) => item.id === id);

        if (!request.body.price) {
                reply.code(400).send('Product must have a price')
        }else{
                items[indexItem] = {id: id, name: items[indexItem].name, price: request.body.price}
                return reply.code(201).send(`Price of the product that had for id:${id} has been updated`);
        }
})


// Run the server!
const start = async () => {
        try {
                await fastify.listen(3000, '0.0.0.0')
        } catch (err) {
                fastify.log.error(err)
                process.exit(1)
        }
}
start()
