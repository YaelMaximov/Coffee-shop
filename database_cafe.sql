

-- DROP DATABASE database_cafe;

CREATE DATABASE database_cafe;
USE database_cafe;

-- Table: Members (חברי מועדון)
CREATE TABLE Members (
    member_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each member
    first_name VARCHAR(100) NOT NULL, -- Member's first name
    last_name VARCHAR(100) NOT NULL, -- Member's last name
    gender ENUM('זכר', 'נקבה'), -- Member's gender
    phone VARCHAR(20) NOT NULL, -- Member's phone number
    email VARCHAR(255) NOT NULL, -- Member's email
    birthdate DATE, -- Member's birthdate
    city VARCHAR(100) -- Member's city
);

-- Table: Orders (הזמנות)
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each order
    member_id INT, -- Foreign key for Members table (nullable for non-members)
    order_type ENUM('משלוח', 'איסוף עצמי') NOT NULL, -- Type of order: Delivery or Pickup
    total_price DECIMAL(10, 2) NOT NULL, -- Total price of the order
    notes TEXT, -- Optional notes for the order
    FOREIGN KEY (member_id) REFERENCES Members(member_id) -- Link to Members table (can be NULL)
);

-- Table: Dishes (מנות)
CREATE TABLE Dishes (
    dish_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each dish
    name VARCHAR(100) NOT NULL, -- Name of the dish
    description TEXT, -- Description of the dish
    price DECIMAL(10, 2) NOT NULL, -- Price of the dish
    image_url VARCHAR(255), -- URL for the dish image
    category ENUM('ארוחת בוקר', 'מנות פתיחה', 'כריכים', 'סלטים', 'איטלקי', 
                  'עיקריות', 'קינוח', 'משקאות קרים', 'משקאות חמים', 'שייקים') NOT NULL -- Dish category
);

-- Table: Order_Dishes (מנות בהזמנה)
CREATE TABLE Order_Dishes (
    order_dish_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each order-dish relation
    order_id INT NOT NULL, -- Foreign key for Orders table
    dish_id INT NOT NULL, -- Foreign key for Dishes table
    quantity INT NOT NULL, -- Quantity of the dish in the order
    FOREIGN KEY (order_id) REFERENCES Orders(order_id), -- Link to Orders table
    FOREIGN KEY (dish_id) REFERENCES Dishes(dish_id) -- Link to Dishes table
);

-- Table: Extras (תוספות)
CREATE TABLE Extras (
    extra_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each extra
    name VARCHAR(100) NOT NULL, -- Name of the extra
    category ENUM('רטבים', 'סלטים', 'לחמים', 'פירות', 'בסיס לשייק') NOT NULL -- Category of the extra
);

-- Table: Dish_Extras (תוספות למנה)
CREATE TABLE Dish_Extras (
    dish_extra_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each dish-extra relation
    dish_id INT NOT NULL, -- Foreign key for Dishes table
    extra_id INT NOT NULL, -- Foreign key for Extras table
    FOREIGN KEY (dish_id) REFERENCES Dishes(dish_id), -- Link to Dishes table
    FOREIGN KEY (extra_id) REFERENCES Extras(extra_id) -- Link to Extras table
);

-- Table: Order_Dish_Extras (תוספות למנה בהזמנה)
CREATE TABLE Order_Dish_Extras (
    order_dish_extra_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each order-dish-extra relation
    order_dish_id INT NOT NULL, -- Foreign key for Order_Dishes table
    extra_id INT NOT NULL, -- Foreign key for Extras table
    FOREIGN KEY (order_dish_id) REFERENCES Order_Dishes(order_dish_id), -- Link to Order_Dishes table
    FOREIGN KEY (extra_id) REFERENCES Extras(extra_id) -- Link to Extras table
);

-- Table: Delivery_Orders (הזמנות משלוח)
CREATE TABLE Delivery_Orders (
    order_id INT PRIMARY KEY, -- Foreign key linked to Orders table, also unique ID for delivery orders
    customer_id INT, -- Foreign key linking to Members table (optional for non-members)
    recipient_name VARCHAR(255) NOT NULL, -- Full name of the delivery recipient
    recipient_phone VARCHAR(20) NOT NULL, -- Phone number of the delivery recipient
    street VARCHAR(255) NOT NULL, -- Street address for the delivery
    house_number VARCHAR(10) NOT NULL, -- House number for the delivery
    city VARCHAR(100) NOT NULL, -- City for the delivery
    apartment VARCHAR(10), -- Apartment number (optional)
    entrance VARCHAR(10), -- Entrance number (optional)
    floor VARCHAR(10), -- Floor number (optional)
    payment_method ENUM('כרטיס אשראי', 'מזומן') NOT NULL, -- Payment method for delivery: Credit Card or Cash
    FOREIGN KEY (order_id) REFERENCES Orders(order_id), -- Establish relationship to Orders table
    FOREIGN KEY (customer_id) REFERENCES Members(member_id) -- Establish relationship to Members table (can be NULL)
);

-- Table: Pickup_Orders (הזמנות איסוף עצמי)
CREATE TABLE Pickup_Orders (
    order_id INT PRIMARY KEY, -- Foreign key linked to Orders table, also unique ID for pickup orders
    customer_id INT, -- Foreign key linking to Members table (optional for non-members)
    payment_method ENUM('כרטיס אשראי', 'תשלום בבית העסק') NOT NULL, -- Payment method for pickup: Credit Card or Pay at Store
    FOREIGN KEY (order_id) REFERENCES Orders(order_id), -- Establish relationship to Orders table
    FOREIGN KEY (customer_id) REFERENCES Members(member_id) -- Establish relationship to Members table (can be NULL)
);
-- Table: Managers
CREATE TABLE Managers (
    manager_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each manager
    username VARCHAR(100) NOT NULL, -- Manager's username
    password VARCHAR(255) NOT NULL -- Manager's hashed password
);

-- Table: Member_Discounts
CREATE TABLE Member_Discounts (
    discount_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each discount
    description VARCHAR(255) NOT NULL, -- Description of the discount
    discount_type ENUM('הוזלה במחיר', 'אחוזי הנחה', 'משלוח חינם', 'מוצר מתנה') NOT NULL, -- Type of discount
    discount_value DECIMAL(10, 2), -- Value of the discount (e.g., 15% or 10 NIS)
    minimum_order_value DECIMAL(10, 2), -- Minimum order value to apply the discount
    applicable_to ENUM('כל הפריטים', 'פריטים מסוימים') NOT NULL, -- Whether discount applies to all items or a specific item
    item_id INT, -- If applicable to a specific item, link to the item (e.g., specific dish)
    free_item_id INT, -- ID of the item given for free if applicable
    start_date DATE, -- Start date of the discount
    end_date DATE, -- End date of the discount
    FOREIGN KEY (item_id) REFERENCES Dishes(dish_id), -- Link to Dishes table if specific item
    FOREIGN KEY (free_item_id) REFERENCES Dishes(dish_id) -- Link to Dishes table for free item
);


-- -- Table: General_Discounts
-- CREATE TABLE General_Discounts (
--     discount_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each discount
--     description VARCHAR(255) NOT NULL, -- Description of the discount
--     discount_type ENUM('Fixed Amount', 'Percentage', 'Free Shipping', 'Free Item') NOT NULL, -- Type of discount
--     discount_value DECIMAL(10, 2), -- Value of the discount (e.g., 15% or 10 NIS)
--     minimum_order_value DECIMAL(10, 2), -- Minimum order value to apply the discount
--     applicable_to ENUM('All', 'Category') NOT NULL, -- Whether discount applies to all items or specific category
--     category ENUM('ארוחת בוקר', 'מנות פתיחה', 'כריכים', 'סלטים', 'איטלקי', 
--                   'עיקריות', 'קינוח', 'משקאות קרים', 'משקאות חמים', 'שייקים'), -- Category of dishes if applicable
--     free_item_id INT, -- ID of the item given for free if applicable
--     start_date DATE, -- Start date of the discount
--     end_date DATE, -- End date of the discount
--     FOREIGN KEY (free_item_id) REFERENCES Dishes(dish_id) -- Link to Dishes table for free item
-- );

-- Members
INSERT INTO Members (first_name, last_name, gender, phone, email, birthdate, city) VALUES
('יוסי', 'כהן', 'זכר', '050-1234567', 'yossi@example.com', '1985-05-15', 'תל אביב'),
('רונית', 'לוי', 'נקבה', '052-9876543', 'ronit@example.com', '1990-11-22', 'חיפה'),
('אבי', 'ישראלי', 'זכר', '054-5555555', 'avi@example.com', '1978-03-30', 'ירושלים');

-- Orders
INSERT INTO Orders (member_id, order_type, total_price, notes) VALUES
(1, 'משלוח', 150.50, 'נא להביא סכו"ם'),
(2, 'איסוף עצמי', 85.00, NULL),
(NULL, 'משלוח', 200.75, 'ללא בצל בבקשה');

-- Dishes
INSERT INTO Dishes (name, description, price, image_url, category) VALUES
('שקשוקה', 'תבשיל מסורתי, במחבת לוהטת עם שתי ביצים, לחם הבית וסלט אישי, 63.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/shakshuka-3.jpg', 'ארוחת בוקר'),
('פסטה פומודורו', 'פסטה ברוטב עגבניות טריות', 55.00, 'pasta.jpg', 'איטלקי'),
('קפה הפוך', 'קפה חלב עם אספרסו', 12.00, 'cappuccino.jpg', 'משקאות חמים');

-- Order_Dishes
INSERT INTO Order_Dishes (order_id, dish_id, quantity) VALUES
(1, 1, 2),
(2, 3, 1),
(3, 2, 3);

-- Extras
INSERT INTO Extras (name, category) VALUES
('טחינה', 'רטבים'),
('לחם שום', 'לחמים'),
('בננה', 'פירות');

-- Dish_Extras
INSERT INTO Dish_Extras (dish_id, extra_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Order_Dish_Extras
INSERT INTO Order_Dish_Extras (order_dish_id, extra_id) VALUES
(1, 1),
(2, 3),
(3, 2);

-- Delivery_Orders
INSERT INTO Delivery_Orders (order_id, customer_id, recipient_name, recipient_phone, street, house_number, city, apartment, entrance, floor, payment_method) VALUES
(1, 1, 'יוסי כהן', '050-1234567', 'הרצל', '10', 'תל אביב', '5', 'א', '2', 'כרטיס אשראי'),
(3, NULL, 'דנה ישראלי', '053-9876543', 'ויצמן', '25', 'ירושלים', NULL, NULL, NULL, 'מזומן');

-- Pickup_Orders
INSERT INTO Pickup_Orders (order_id, customer_id, payment_method) VALUES
(2, 2, 'תשלום בבית העסק');

-- Managers
INSERT INTO Managers (username, password) VALUES
('admin1', 'hashed_password_1'),
('manager2', 'hashed_password_2'),
('supervisor3', 'hashed_password_3');

-- Member_Discounts
INSERT INTO Member_Discounts (description, discount_type, discount_value, minimum_order_value, applicable_to, item_id, free_item_id, start_date, end_date) VALUES
('10% הנחה על כל התפריט', 'אחוזי הנחה', 10.00, 100.00, 'כל הפריטים', NULL, NULL, '2024-01-01', '2024-12-31'),
('משלוח חינם בהזמנה מעל 150 ש"ח', 'משלוח חינם', NULL, 150.00, 'כל הפריטים', NULL, NULL, '2024-02-01', '2024-02-28'),
('קפה חינם בקנייה מעל 50 ש"ח', 'מוצר מתנה', NULL, 50.00, 'פריטים מסוימים', NULL, 3, '2024-03-01', '2024-03-31');

