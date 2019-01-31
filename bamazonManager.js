const inquirer = require("inquirer");
const dbConnection = require("./connection");
const cTable = require("console.table");

dbConnection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connection to Bamazon established");
  managerMenu();
});

const managerMenu = () => {
  inquirer.prompt([
    {
      name: "menu_options",
      type: "list",
      message: "What would you like to do",
      choices: ["View all products", "Low inventory products", "Add to inventory", "Add product", "Exit"]
    }
  ])
  .then(({ menu_options }) => {
    console.log(menu_options);

    switch(menu_options) {
      case "View all products":
        return viewProducts();
      case "Low inventory products":
        return lowInventory();
      case "Add to inventory":
        return addStock();
      case "Add product":
        return addProduct();
      case "Exit":
        return process.exit(0);
    }
  })
  .catch(err => console.log(err))
}

// View entire inventory
const viewProducts = () => {

  dbConnection.query("SELECT * FROM products", function(err, currentInv) {
    if (err) {
      throw err;
    }

    console.log("\n----------------------------")
    console.table(currentInv);

    managerMenu();
  })
}

// View inventory that has a stock of less than 5
const lowInventory = () => {
  dbConnection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, currentInv) {
    if (err) {
      throw err;
    }
    console.log("\n----------------------------")
    console.table(currentInv);

    managerMenu();
  });
}

// Add stock quantity to inventory
const addStock = () => {
  dbConnection.query("SELECT * FROM products", function(err, currentInv) {
    if (err) {
      throw err;
    }

    inquirer.prompt([
      {
        name: "product_options",
        type: "list",
        message: "Which product would you like to order more of?",
        choices: currentInv.map(product => product.product_name),
      },
      {
        name: "order_stock",
        type: "input",
        message: "How much do you want to order?",
        validate: function (input) {
          return !isNaN(input);
        },
        filter: function (input) {
          return parseInt(input);
        }
      }
    ])
    .then(({ product_options, order_stock }) => {

      const productID = currentInv.find(product => product.product_name === product_options)
      const productQuantity = productID.stock_quantity
      const addQuantity = productQuantity + order_stock;

      const updateProduct = {
        id: productID.id
      }

      const updateQuantity = {
        stock_quantity: addQuantity
      }

      dbConnection.query("UPDATE products SET ? WHERE ?", [updateQuantity, updateProduct], function(err) {
        if (err) {
          throw err;
        }
        managerMenu();
      })
    })
    .catch(err => console.log(err));
  });
}

// adds product to inventory
const addProduct = () => {
  inquirer.prompt([
    {
      name: "product_name",
      message: "What is the product",
      type: "input"
    },
    {
      name: "department_name",
      message: "What department is the product in?",
      type: "input"
    },
    {
      name: "price",
      message: "How much is the product?",
      type: "input",
      validate: function (input) {
        return !isNaN(input);
      },
      filter: function (input) {
        return parseInt(input);
      }
    },
    {
      name: "stock_quantity",
      message: "How much stock of the product?",
      type: "input",
      validate: function (input) {
        return !isNaN(input);
      },
      filter: function (input) {
        return parseInt(input);
      }
    }
  ])
  .then(({ product_name, department_name, price, stock_quantity}) => {
    
    const productData = {
      product_name: product_name,
      department_name: department_name,
      price: price,
      stock_quantity: stock_quantity
    };

    dbConnection.query("INSERT INTO products SET ?", productData, function(err, currentInv) {
      if (err) {
        throw err;
      }
      console.log("\n----------------------------")
      console.log(currentInv);
      managerMenu();
    })
  })
};