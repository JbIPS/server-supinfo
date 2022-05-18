const axios = require('axios').default;

async function start() {
        const result = await axios.get('http://localhost:3000/products');
        console.log(result.data);

        // const putResult = await axios.put('http://localhost:3000/products/add', {
        //         name: 'add test',
        //         price: 223
        // });

        // const delResult = await axios.delete('http://localhost:3000/products/delete/5');

        const updateResult = await axios.patch('http://localhost:3000/products/patch/1', {
                price:  667
        });
        console.log(updateResult.status, updateResult.statusText, updateResult.data);
}

start();

