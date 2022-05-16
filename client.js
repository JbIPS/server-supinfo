const axios = require('axios').default;

async function start() {
        const result = await axios.get('http://localhost:3000/products');
        console.log(result.data);

        const putResult = await axios.put('http://localhost:3000/products/2', {
                name: 'Règle',
                price: 2
        });
        console.log(putResult.status, putResult.statusText, putResult.data);
}

start();

