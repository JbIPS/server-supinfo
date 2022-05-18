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
  const id = parseInt(request.params.id, 10)

  if (!request.body.name || !request.body.price) {
    reply.code(400).send("Product must have a name and a price");
  } else {
		const existingPorductKey = items.findIndex((item) => item.id === id);

    if(existingPorductKey != -1){
      items[existingPorductKey] = {
				id: id,
				name: request.body.name,
				price: request.body.price,
			}
			return reply
				.code(201)
				.send(`Product ${request.body.name} has been updated`);
    }else {
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

	if(existingPorductKey != -1){
		items[existingPorductKey].price = price;
		return reply
			.code(201)
			.send(`Product ${id} has been updated`);
	}else {
		return reply
		.code(404)
			.send(`Error: no product found`);
	}
});

fastify.delete("/products/:id", async (request, reply) => {
	const id = parseInt(request.params.id, 10);
	const itemToRemoveKey = items.findIndex((item) => item.id === id);
	items.splice(itemToRemoveKey, 1);

	return reply
      .code(201)
      .send(`Product ${id} has been deleted`);
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
