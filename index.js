const fastify = require("fastify")({ logger: true });

const items = [
  {
    id: 1,
    name: "Cartable",
    price: 4,
  },
];

// Declare a route
fastify.get("/", async (request, reply) => {
  const qs = request.query;
  if (qs.from === "jb") {
    return `Hello ${qs.from}: here's your secret!`;
  } else {
    reply.code(401).send("Unauthorized");
  }
});

fastify.get("/products", async (request, reply) => {
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
  const id = parseInt(request.params.id, 10);
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
