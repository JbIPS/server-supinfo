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


// Add a new product

fastify.post('/products/add', (request, reply) => {
        const newProduct = {
                id: request.body.id,
                name: request.body.name,
                price: request.body.price
        }
        products.push(newProduct)
        reply.status(201).json(newProduct)
})

// Delete the product

fastify.delete('/products/:id', (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const index = products.findIndex(product => product.id === id)
        if (index === -1) {
                return reply.status(404).send('Product not found')
        }
        products.splice(index, 1)
        reply.status(200).json('Product deleted')
})

// Update product

fastify.put('/products/:id', (request, reply) => {
        const id = Number(request.params.id)
        const index = products.findIndex(product => product.id === id)
        if (index === -1) {
                return reply.status(404).send('Product not found')
        }
        const updatedProduct = {
                id: products[index].id,
                name: request.body.name,
                price: request.body.price
        }
        products[index] = updatedProduct
        reply.status(200).json('Product updated')
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