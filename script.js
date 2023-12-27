
const API_URL = "https://crudcrud.com/api/1138d1800c5d43ddb7c0ae84387cc59e/orders";
const tables = {
    'Table 1': { element: document.getElementById('table1-orders'), orders: [] },
    'Table 2': { element: document.getElementById('table2-orders'), orders: [] },
    'Table 3': { element: document.getElementById('table3-orders'), orders: [] },
};

const maxOrdersPerTable = 5;

    document.getElementById('btn').addEventListener('click', async function (event) {
           event.preventDefault();

    let price = document.getElementById('price').value;
    let dish = document.getElementById('dish').value;
    let table = document.getElementById('table').value;

    if (tables[table].orders.length >= maxOrdersPerTable) {
        alert(`Table ${table} is full. Cannot add more orders.`);
        return;
    }

    let order = {
        price: price,
        dish: dish,
        table: table
    };

    await restaurantData(order);

    document.getElementById('price').value = '';
    document.getElementById('dish').value = '';
    document.getElementById('table').value = '';
});

document.addEventListener('DOMContentLoaded', function () {
    fetchOrdersFromAPI();
});

async function restaurantData(order) {
    try {
        const response = await axios.post(API_URL, order);
        const orderId = response.data._id;
        const updatedOrder = { _id: orderId, ...order };
        const table = tables[order.table];
        table.orders.push(updatedOrder);
        displayOrderOnScreen(updatedOrder, table);

        alert('Order placed successfully!');
    } catch (error) {
        console.log(error);
        alert('Oops, something went wrong. Please try again.');
    }
}

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
 // Implement the deleteOrder function 
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
        // Implement the update functionality here


    });

    listItem.appendChild(deleteButton);
    listItem.appendChild(updateButton);

    table.element.appendChild(listItem);
}

