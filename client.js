const axios = require('axios').default;

async function start() {
        const result = await axios.get('http://localhost:3000/products');
        console.log(result.data);

        const putResult = await axios.put('http://localhost:3000/products/2', {
                name: 'Cartable',
                price: 2
        });

        const pushResult = await axios.post("http://localhost:3000/products/new-product", {
                name: "Chaise",
                price: 4,
          });

        const patchResult = await axios.patch("http://localhost:3000/products/2", {
	        newPrice: 9
	});

        try {
		const deleteResult = await axios.delete("http://localhost:3000/products/2", { headers: {
			authorization: "Baptiste"
		} });
		console.log(deleteResult.status, deleteResult.statusText, deleteResult.data);
	} catch (error) {
		console.log(error);
	}
}

start();

