const API_URL = "https://crudcrud.com/api/11cda7430d87426cb8de54ae98c5948c/orders";

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form');
  const table1Orders = document.getElementById('table1-orders');
  const table2Orders = document.getElementById('table2-orders');
  const table3Orders = document.getElementById('table3-orders');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const price = document.getElementById('price').value;
    const dish = document.getElementById('dish').value;
    const table = document.getElementById('table').value;

    const listItem = document.createElement('li');
    listItem.textContent = `Price: ${price}, Dish: ${dish}`;

    if (table === 'Table 1') {
      table1Orders.appendChild(listItem);
    } else if (table === 'Table 2') {
      table2Orders.appendChild(listItem);
    } else if (table === 'Table 3') {
      table3Orders.appendChild(listItem);
    }

    const butter = {
      price: price,
      dish: dish,
      table: table
    };

    try {
      const response = await axios.post(API_URL, butter);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    form.reset();
  });

  async function fetchOrdersFromAPI() {
    try {
      const response = await axios.get(API_URL);
      response.data.forEach(function(order) {
        displayOrderOnScreen(order);
      });
    } catch (error) {
      console.log(error);
    }
  }

  function deleteOrder(orderId) {
    const CancelOrder = document.getElementById(orderId);
    CancelOrder.remove();

    axios.delete(`${API_URL}/${orderId}`)
      .catch(function(err) {
        console.log(err);
      });
  }

  async function updateOrderInAPI(orderId) {
    try {
      const response = await axios.put(`${API_URL}/${orderId}`);
      console.log(response.data);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  function displayOrderOnScreen(order) {
    const listItem = document.createElement('li');
    listItem.textContent = `Price: ${order.price}, Dish: ${order.dish}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      deleteOrder(order._id);
    });

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Edit';
    updateButton.addEventListener('click', function() {
      updateOrderInAPI(order._id);
    });

    listItem.appendChild(deleteButton);
    listItem.appendChild(updateButton);

    if (order.table === 'Table 1') {
      table1Orders.appendChild(listItem);
    } else if (order.table === 'Table 2') {
      table2Orders.appendChild(listItem);
    } else if (order.table === 'Table 3') {
      table3Orders.appendChild(listItem);
    }
  }

  fetchOrdersFromAPI();
});