INSERT INTO `roles`
(`RoleId`, `Description`)
VALUES
(0, 'Seller'),
(1, 'Customer');

INSERT INTO `users`
(`Email`, `Role`, `Password`, `PasswordSalt`, `PhoneNum`, `Active`, `Budget`)
VALUES
('ale.2000.ar26@gmail.com', 0, 'f3cbd7d0648f5931d0425c179e93d63d833e44804619e7695d455ef6d4438f381996ab9e7c0bda2c0a790a5e33bd2ccc2c5974457821811ebcaad5708e0afe59', '96d6f244f2dcac51dc444395d48d72e1dc83be972c2805d32da3d02538c88b787b077874f0bb1fd182a1fabbe68f46a3c9d59ec016862cf884ee2b7c20843158', NULL, 0, 0);

INSERT INTO `product_categories`
(`Description`)
VALUES
('Gioco da tavolo'),
('Gioco di carte'),
('Rompicapo');

INSERT INTO `products`
(`Name`, `ShortDesc`, `LongDesc`, `Price`, `PlayerNumFrom`, `PlayerNumTo`, `Category`, `StockQuantity`, `ImageName`)
VALUES
('Monopoly', 'Il classico Monopoly', 'Descrizione lunga di test', 29.99, 1, 4, 1, 10, 'Monopoly.jpg'),
('Exploding Kittens', 'Gioco di carte con gattini', 'Descrizione lunga di test', 19.99, 1, 8, 2, 20, 'Exploding Kittens.jpg'),
('Cubo di Rubik', 'Il rompicapo più famoso', 'Descrizione lunga di test', 4.99, 1, 1, 2, 30, 'Cubo Rubik.png');

-- INSERT INTO `notification_types` VALUES

INSERT INTO `order_status`
(`Description`)
VALUES
('Da spedire'),
('In spedizione'),
('Cancellato'),
('Arrivato');