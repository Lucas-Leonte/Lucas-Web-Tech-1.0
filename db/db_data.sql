INSERT INTO `roles`
(`RoleId`, `Description`)
VALUES
(0, 'Admin'),
(1, 'Customer');

INSERT INTO `users`
(`Email`, `Password`, `Role`, `PhoneNum`, `Active`, `Budget`)
VALUES
('ale.2000.ar26@gmail.com', 'admin', 0, NULL, 0, 0);

INSERT INTO `product_categories`
(`Description`)
VALUES
('Gioco da tavolo'),
('Gioco di carte'),
('Rompicapo');

INSERT INTO `products`
(`Name`, `ShortDesc`, `LongDesc`, `Price`, `PlayerNumFrom`, `PlayerNumTo`, `Category`, `StockQuantity`)
VALUES
('Monopoly', 'Il classico Monopoly', 'Descrizione lunga di test', 29.99, 1, 4, 1, 10),
('Exploding Kittens', 'Gioco di carte con gattini', 'Descrizione lunga di test', 19.99, 1, 8, 2, 20),
('Cubo di Rubik', 'Il rompicapo più famoso', 'Descrizione lunga di test', 4.99, 1, 1, 2, 30);

-- INSERT INTO `notification_types` VALUES

INSERT INTO `order_status`
(`Description`)
VALUES
('Da spedire'),
('In spedizione'),
('Cancellato'),
('Arrivato');