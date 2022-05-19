const fastify = require("fastify")({ logger: true });
const rateLimit = require('@fastify/rate-limit');
const helmet = require('@fastify/helmet');
const authPlugin = require("./authPlugin");

const items = [
  {
    id: 1,
    name: "Cartable",
    price: 4,
  },
];

const users = [
  {
    mail: 'emeric',
    password: 'superP4ss'
  },
  {
    mail: 'solo',
    password: 'soloP4ss'
  }
];

fastify.register(authPlugin, {
  users: users
});

fastify.register(rateLimit, {
  max: 10,
  timeWindow: '1 minute'
});

fastify.register(helmet, {
  contentSecurityPolicy: false
});

// Declare a route
fastify.get("/", async () => {
  return `hello ${request.user}`;
});

fastify.get("/products", async () => {
  return items;
});

fastify.get("/products/:id", async (request, reply) => {
  const id = parseInt(request.params.id, 10);
  const desiredItem = items.find((item) => item.id === id);
  if (desiredItem) {
    return desiredItem;
  } else {
    reply.code(404).send("not found");
  }
});

fastify.put("/products/:id", async (request, reply) => {
  const id = parseInt(request.params.id, 10)

  if (!request.body.name || !request.body.price) {
    reply.code(400).send("Product must have a name and a price");
  } else {
    const existingPorductKey = items.findIndex((item) => item.id === id);

    if (existingPorductKey != -1) {
      items[existingPorductKey] = {
        id: id,
        name: request.body.name,
        price: request.body.price,
      }
      return reply
        .code(201)
        .send(`Product ${request.body.name} has been updated`);
    } else {
      items.push({
        id: id,
        name: request.body.name,
        price: request.body.price,
      });
      return reply
        .code(201)
        .send(`Product ${request.body.name} has been created`);
    }
  }
});

fastify.post("/products/new-product", async (request, reply) => {
  const lastItem = items[items.length - 1];
  const id = lastItem.id + 1;

  if (!request.body.name || !request.body.price) {
    reply.code(400).send("Product must have a name and a price");
  } else {
    items.push({
      id: id,
      name: request.body.name,
      price: request.body.price,
    });
    return reply
      .code(201)
      .send(`Product ${request.body.name} has been created`);
  }
});

fastify.patch("/products/:id", async (request, reply) => {
  const id = parseInt(request.params.id, 10);
  const price = parseInt(request.body.newPrice, 10);
  const existingPorductKey = items.findIndex((item) => item.id === id);

  if (existingPorductKey != -1) {
    items[existingPorductKey].price = price;
    return reply
      .code(200)
      .send(`Product ${id} has been updated`);
  } else {
    return reply
      .code(404)
      .send(`Error: no product found`);
  }
});

fastify.delete("/products/:id", async (request, reply) => {
  const id = parseInt(request.params.id, 10);
  const itemToRemoveKey = items.findIndex((item) => item.id === id);

  if (itemToRemoveKey != -1) {
    items.splice(itemToRemoveKey, 1);
    return reply
      .code(204);
  } else {
    return reply
      .code(404)
      .send(`Error: no product found`);
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000, "0.0.0.0");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
