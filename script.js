const API_URL = "https://crudcrud.com/api/c4c80cfce15b4e4996402d251b7a58b2/orders";

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const tables = {
        'Table 1': { element: document.getElementById('t1'), orders: [] },
        'Table 2': { element: document.getElementById('t2'), orders: [] },
        'Table 3': { element: document.getElementById('t3'), orders: [] },
    };


    const maxOrdersPerTable = 5;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const price = document.getElementById('price').value;
        const dish = document.getElementById('dish').value;
        const table = document.getElementById('table').value;

        if (tables[table].orders.length >= maxOrdersPerTable) {
            alert(`Table ${table} is full. Cannot add more orders.`);
            return;
        }

        const orderData = {
            price: price,
            dish: dish,
            table: table
        };

        try {
            const response = await axios.post(API_URL, orderData);
            const orderId = response.data._id;
            const order = { _id: orderId, price, dish, table };
            tables[table].orders.push(order);

            displayOrderOnScreen(order, tables[table]);

            alert('Order placed soon!!');
        } catch (error) {
            console.log(error);
            alert('Ooops , try again please.');
        }

        form.reset();
    });

    async function fetchOrdersFromAPI() {
        try {
            const response = await axios.get(API_URL);
            response.data.forEach(order => {
                const table = tables[order.table];
                table.orders.push(order);
                displayOrderOnScreen(order, table);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteOrder(orderId, table) {
        try {
            await axios.delete(`${API_URL}/${orderId}`);
            const orderIndex = table.orders.findIndex(order => order._id === orderId);
            if (orderIndex !== -1) {
                table.orders.splice(orderIndex, 1);
            }

            document.getElementById(orderId).remove();
        } catch (error) {
            console.log(error);
            alert('Please try again.');
        }
    }

    async function updateOrderInAPI(orderId, newPrice, newDish, table) {
        try {
            const response = await axios.put(`${API_URL}/${orderId}`, {
                price: newPrice,
                dish: newDish
            });
            console.log(response.data);

            const orderIndex = table.orders.findIndex(order => order._id === orderId);
            if (orderIndex !== -1) {
                const updatedOrder = {
                    _id: orderId,
                    price: newPrice,
                    dish: newDish,
                    table: table.orders[orderIndex].table
                };
                table.orders[orderIndex] = updatedOrder;

                const listItem = document.getElementById(orderId);
                listItem.textContent = `Price: ${newPrice}, Dish: ${newDish}`;

                alert('Order updated successfully!');
            }
        } catch (error) {
            console.log(error);
            alert('Error updating order. Please try again.');
        }
    }

    function displayOrderOnScreen(order, table) {
        const listItem = document.createElement('li');
        listItem.id = order._id;
        listItem.textContent = `Price: ${order.price}, Dish: ${order.dish}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteOrder(order._id, table);
        });

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Edit';
        updateButton.addEventListener('click', function () {
            const newPrice = prompt('Enter new price:', order.price);
            const newDish = prompt('Enter new dish:', order.dish);
            updateOrderInAPI(order._id, newPrice, newDish, table);
         });
 
        listItem.appendChild(deleteButton);
        listItem.appendChild(updateButton);

        table.element.appendChild(listItem);
    }

    fetchOrdersFromAPI();
});
