const fastify = require('fastify')({ logger: true })
const helmet = require('@fastify/helmet')
const authPlugin = require("./authPlugin")
const items = [{
        id: 1,
        name: 'Cartable',
        price: 4
}]

const users = [{username : "solo", password: "superP4ss"}]

fastify.register(authPlugin,{
        tableUsers: users
})


fastify.register(helmet,{
         contentSecurityPolicy: false 
})

fastify.register(require('@fastify/rate-limit'),{
        max: 100,
        timeWindow: '1 minute'
});

// Declare a route
fastify.get('/', async (request, reply) => {
        return "hello you're welcome"
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

fastify.put('/products/:id', async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const indexItem = items.findIndex((item) => item.id === id);

        if (!request.body.name || !request.body.price) {
                reply.code(400).send('Product must have a name and a price')
        } else {
                if (indexItem !== -1) {
                        items[indexItem] = {id: id, name: request.body.name, price: request.body.price}
                        return reply.code(200).send(`Product ${request.body.name} has been updated`);

                } else {
                        items.push({
                                id: id,
                                name: request.body.name,
                                price: request.body.price
                        });
                        return reply.code(201).send(`Product ${request.body.name} has been created`);
                }
                
        }
})

fastify.post('/products/add', async (request, reply) => {

        if (!request.body.name || !request.body.price) {
                reply.code(400).send('Product must have a name and a price');
        } else {
                const idToAdd = Math.max(...items.map(o => o.id)) + 1;
                items.push({
                        id: idToAdd,
                        name: request.body.name,
                        price: request.body.price
                });
                return reply.code(201).send(`Product ${request.body.name} has been created and the id wanted is  ${idToAdd}`);
        }
})

fastify.delete('/products/:id', async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const indexItem = items.findIndex((item) => item.id === id);

        if (indexItem !== -1) {
                items.splice(indexItem,1)
                return reply.code(204);
        } else {
                reply.code(404).send('id not found');
        }
})

fastify.patch('/products/:id', async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const indexItem = items.findIndex((item) => item.id === id);

        if (!request.body.price) {
                reply.code(400).send('Product must have a price')
        }else{
                items[indexItem] = {id: id, name: items[indexItem].name, price: request.body.price}
                return reply.code(200).send(`Price of the product that had for id:${id} has been updated`);
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
