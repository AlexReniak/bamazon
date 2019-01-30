const inquirer = require("inquirer");
const dbConnection = require("./connection");
const cTable = require("console.table");

dbConnection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connection to Bamazon established. Welcome to Bamazon");
  orderProduct();
});

// order product function allows user to order whichever product that is in stock
const orderProduct = () => {
  dbConnection.query("SELECT * FROM products", function (err, dbInventory) {
    if (err) {
      throw err;
    }
    
    // Display entire inventory to user upon starting app
    console.table(dbInventory);

    inquirer.prompt([
      {
        name: "place_order",
        type: "list",
        message: "Which item would you like to order?",
        choices: dbInventory.map(product => product.product_name,)
      },
      {
        name: "order_product",
        message: "How many would you like?",
        validate: function (input) {
          return !isNaN(input);
        },
        filter: function (input) {
          return parseInt(input);
        }
      }
    ])
    .then(({ place_order, order_product }) => {
      const itemPicked = dbInventory.find(product => product.product_name === place_order);

      console.log(itemPicked)

      const productQuantity = itemPicked.stock_quantity;
      
      if (order_product > productQuantity) {
        console.log("There's not enough in stock to fulfill that order");
        return orderProduct();
      };

      const updatedQuantity = {
        stock_quantity: productQuantity - order_product
      }
      
      console.log(updatedQuantity);

      const updatedProduct = {
        id: itemPicked.id
      }

      // Update database with new quantity
      dbConnection.query("UPDATE products SET ? WHERE ?", [updatedQuantity, updatedProduct],
      function (err) {
        if (err) {
          throw err;
        }

        // Let user know their order of product and quantity has been received
        console.log(`Your order of ${order_product} ${itemPicked.product_name} has been placed`)
        console.log(`Total cost = $${order_product * itemPicked.price}`)
        orderProduct();
      })
    })
    .catch(err => console.log(err))
  })
}