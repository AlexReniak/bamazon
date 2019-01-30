DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
id INTEGER(10) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price INTEGER(10) NOT NULL,
stock_quantity INTEGER(10) NOT NULL,
PRIMARY KEY (id)
);

INSERT INTO 
	products (product_name, department_name, price, stock_quantity)
VALUES
	("laptop", "electronics", 200, 8),
  ("phone", "electronics", 100, 5),
  ("headphones", "electronics", 12, 20),
	("shirts", "clothing", 10, 15),
  ("shoes", "footwear", 20, 12),
  ("socks", "clothing", 5, 16),
  ("ski goggles", "sports", 15, 7),
  ("books", "entertainment", 8, 5),
  ("Honda Civic", "auto", 1000, 2)
