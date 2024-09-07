

                
DROP DATABASE database_cafe;

CREATE DATABASE database_cafe;
USE database_cafe;

-- Table: Branches (סניפים)
CREATE TABLE Branches (
    branch_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each branch
    address VARCHAR(255) NOT NULL, -- Branch address
    phone VARCHAR(20) NOT NULL, -- Branch phone number
    opening_hours VARCHAR(100) NOT NULL ,-- Branch opening hours
	google_maps_link VARCHAR(255) 
);

-- Table: Addresses (כתובות)
CREATE TABLE Addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each address
    street VARCHAR(255) NOT NULL, -- Street name
    house_number VARCHAR(10) NOT NULL, -- House number
    city VARCHAR(100) NOT NULL, -- City
    apartment VARCHAR(10), -- Apartment number (optional)
    entrance VARCHAR(10), -- Entrance number (optional)
    floor VARCHAR(10) -- Floor number (optional)
);

CREATE TABLE Members (
    member_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each member
    first_name VARCHAR(100) NOT NULL, -- Member's first name
    last_name VARCHAR(100) NOT NULL, -- Member's last name
    gender ENUM('זכר', 'נקבה'), -- Member's gender
    phone VARCHAR(20) NOT NULL, -- Member's phone number
    email VARCHAR(255) NOT NULL UNIQUE, -- Member's email (Unique constraint added for email)
    birthdate DATE, -- Member's birthdate
    address_id INT, -- Foreign key to Addresses table
    password_hash VARCHAR(255) NOT NULL, -- Hashed password
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id) -- Link to Addresses table
);


-- Table: Orders (הזמנות)
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each order
    member_id INT, -- Foreign key for Members table (nullable for non-members)
    order_type ENUM('משלוח', 'איסוף עצמי') NOT NULL, -- Type of order: Delivery or Pickup
    total_price DECIMAL(10, 2) NOT NULL, -- Total price of the order
    notes TEXT, -- Optional notes for the order
    order_date DATE, -- Date of the order
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
                  'מנות עיקריות', 'קינוחים', 'משקאות קרים', 'משקאות חמים', 'שייק פירות') NOT NULL -- Dish category
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
    category ENUM('רטבים', 'סלטים', 'לחמים', 'פירות', 'בסיס לשייק') NOT NULL, -- Category of the extra
    price DECIMAL(5,2) DEFAULT 0, -- Price of the extra, only applicable to 'רטבים'
    has_price BOOLEAN NOT NULL DEFAULT FALSE, -- Indicates if the extra has a price
    max_quantity INT NOT NULL -- Maximum allowed quantity for the extra
);


-- Table: Dish_Extras (תוספות למנה)
CREATE TABLE Dish_Extra_Categories (
    dish_extra_category_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each dish-extra category relation
    dish_id INT NOT NULL, -- Foreign key for Dishes table
    extra_category ENUM('רטבים', 'סלטים', 'לחמים', 'פירות', 'בסיס לשייק') NOT NULL, -- Category of the extra
    FOREIGN KEY (dish_id) REFERENCES Dishes(dish_id) -- Link to Dishes table
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
    recipient_name VARCHAR(255) NOT NULL, -- Full name of the delivery recipient
    recipient_phone VARCHAR(20) NOT NULL, -- Phone number of the delivery recipient
    address_id INT NOT NULL, -- Foreign key to Addresses table
    payment_method ENUM('כרטיס אשראי', 'מזומן') NOT NULL, -- Payment method for delivery: Credit Card or Cash
    FOREIGN KEY (order_id) REFERENCES Orders(order_id), -- Establish relationship to Orders table
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id) -- Link to Addresses table
);

-- Table: Pickup_Orders (הזמנות איסוף עצמי)
CREATE TABLE Pickup_Orders (
    order_id INT PRIMARY KEY, -- Foreign key linked to Orders table, also unique ID for pickup orders
    payment_method ENUM('כרטיס אשראי', 'תשלום בבית העסק') NOT NULL, -- Payment method for pickup: Credit Card or Pay at Store
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) -- Establish relationship to Orders table
);

-- Table: Managers (מנהלים)
CREATE TABLE Managers (
    manager_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each manager
    username VARCHAR(100) NOT NULL, -- Manager's username
    password VARCHAR(255) NOT NULL -- Manager's hashed password
);

INSERT INTO Managers (username, password) 
 VALUES ('orikono', '123');
 
-- Table: Member_Discounts (הנחות לחברי מועדון)
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


INSERT INTO Branches (address, phone, opening_hours, google_maps_link) 
VALUES ('רחוב יפו 123, ירושלים', '02-1234567', 'א׳-ה׳: 08:00-20:00, ו׳: 08:00-14:00', 'https://goo.gl/maps/exampleLink');


-- (12ארוחת בוקר)
INSERT INTO Dishes (name, description, price, image_url, category) VALUES
('וופל אמריקאי', 'קריספי וופל, בצל ופטריות מוקפצות ברוטב 4 גבינות, ביצים עלומות, בצל ירוק, מוגש עם סלט לבחירה.', 57.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/vafel-americai-2.jpg', 'ארוחת בוקר'),
('וופל נורווגי', 'קריספי וופל, סלמון מעושן, תרד ובצל מוקפצים בחמאה ורוטב גבינות, ביצי עין ובצל ירוק,  מוגש עם סלט לבחירה.', 69.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/vafel-norvegi.jpg', 'ארוחת בוקר'),
('שקשוקה טבעונית', 'כדורי פלאפל, קוביות בטטה, חציל קלוי וטחינה גולמית', 67.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/shakshuka-tivonit_-2.jpg', 'ארוחת בוקר'),
('בוקר יווני', 'ביצי עין מוגשות על טירופיטה גבינות ותרד, מוגש לצד סקורדלייה שקדים, לאבנה געלה וסלסת עגבניות , צפתית ודבש מתובל עם אגוזי מלך וסלט יווני. (מוגש ללא לחם)', 63.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/boker-yevani.jpg', 'ארוחת בוקר'),
('ארוחת בוקר יחיד מהטבע VO', 'חביתת קטניות , פרוסות גבינה צהובה טבעונית, , גוואקמולי,, גבינה טבעונית למריחה,פרוסות בולגרית טבעוניות, סלט פירות וגרנולה, קונפיטורה, טחינה, סלסת עגבניות ובלסמי ,סלט אישי, לחם הבית,  מוגש עם קפה קטן ושתייה קרה קטנה, תפוזים/גזר/לימונדה', 79.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/boker-yachid-tivoni.jpg', 'ארוחת בוקר'),
('ארוחת בוקר זוגית מהטבע VO', 'חביתת קטניות , פרוסות גבינה צהובה טבעונית, , גוואקמולי,, גבינה טבעונית למריחה,פרוסות בולגרית טבעוניות, סלט פירות וגרנולה, קונפיטורה, טחינה, סלסת עגבניות ובלסמי ,סלט אישי, לחם הבית,  מוגש עם קפה קטן ושתייה קרה קטנה, תפוזים/גזר/לימונדה', 148.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/boker-zugi-tivoni.jpg', 'ארוחת בוקר'),
('בוקר זוגי', 'ביצים/אומלט לבחירה, בולגרית וזעתר, לאבנה געלה, גבינת שמנת ובצל ירוק, גוואקמולי, משוויה, סלט טונה, צפתית ודבש מתובל עם אגוזי מלך,, סקורדליה שקדים, סלסת עגבניות ובלסמי, קונפיטורה, רוגלך שוקולד, לחם הבית, סלט לבחירה. מוגש עם קפה קטן ושתייה קרה קטנה, תפוזים/גזר/לימונדה *שינוי או הגדלת שתייה בתוספת תשלום * ניתן לקבל גרסה טבעונית של המנה', 148.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/boker-zugi.jpg', 'ארוחת בוקר'),
('בוקר יחיד',  'ביצים/אומלט לבחירה, בולגרית וזעתר, לאבנה געלה , גבינת שמנת ובצל ירוק, גוואקמולי, סלט טונה, סלסת עגבניות ובלסמי ,קונפיטורה, רוגלך שוקולד, לחם הבית, סלט לבחירה. מוגש עם קפה קטן ושתייה קרה קטנה: תפוזים/גזר/אשכוליות/לימונדה *שינוי או הגדלת שתייה בתוספת תשלום * ניתן לקבל גרסה טבעונית של המנה', 79.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/דצמבר-23-747.jpg', 'ארוחת בוקר'),
('בורקס טורקי', 'בורקס במילוי גבינות, מוגש עם לאבנה געלה, משוויה, ביצה קשה, סלסת פלפלים, עגבניות מרוסקות ושמן זית מוגש עם מלפפון חמוץ וירקות טריים.', 59.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/burekas-turki.jpg', 'ארוחת בוקר'),
('בריוש צרפתי', 'בריוש, חמאת כמהין, רוטב אלפרדו פטריות, גבינת מוצרלה, ביצי עין ובצל ירוק. מוגש עם סלט אישי.', 67.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/brish-tsarfati.jpg', 'ארוחת בוקר'),
('מעדן מוזלי', 'פירות העונה, יוגורט וגרנולה, לצד טחינה גולמית וסילאן', 36.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/musleu.jpg', 'ארוחת בוקר'),
('Eggs בנדיקט', 'בריוש, תרד, הולנדייז, ביצים עלומות, ריבת בצל, בצל ירוק ופלפל שחור. מוגש עם סלט לבחירה.', 67.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/benedict.jpg', 'ארוחת בוקר');

-- (מנות פתיחה)
INSERT INTO Dishes (name, description, price, image_url, category) VALUES
("צ'יפס זוקיני", "קריספי זוקיני, לצד מטבל איולי טרטר.", 32.00, "https://gregcafe.co.il/wp-content/uploads/2024/01/chips-zukini-ave.jpg", "מנות פתיחה"),
("סמוסה ישראלית", "תיאור של סמוסה ישראלית.", 35.00, "https://gregcafe.co.il/wp-content/uploads/2024/01/samosa.jpg", "מנות פתיחה"),
("טרטר חציל", "תיאור של טרטר חציל.", 43.00, "https://gregcafe.co.il/wp-content/uploads/2024/01/tartar-chatsil-2.jpg", "מנות פתיחה"),
("צ'יפס 4 גבינות", "תיאור של צ'יפס 4 גבינות.", 48.00, "https://gregcafe.co.il/wp-content/uploads/2024/01/chips-chedder.jpg", "מנות פתיחה"),
("מחבת נתחי דג", "תיאור של מחבת נתחי דג.", 49.00, "https://gregcafe.co.il/wp-content/uploads/2024/01/machvat-nitchei-dag.jpg", "מנות פתיחה"),
("ריזוטו פטריות", "אורז ארבוריו, ציר ירקות ושמנת בבישול ארוך, ראגו פטריות, פרמזן ובצל ירוק.", 47.00, "https://gregcafe.co.il/wp-content/uploads/2023/04/rissotto.jpg", "מנות פתיחה"),
("סלט פנצנלה", "מיקס עגבניות, קרעי מוצרלה, שום קונפי, בצל סגול וזיתי קלמטה, נענע, בזיליקום ופטרוזיליה, מתובל בלימון ושמן זית, בלסמי מצומצם מוגש עם פוקצ'ינה.", 49.00, "https://gregcafe.co.il/wp-content/uploads/2023/04/salat-pantsanela.jpg", "מנות פתיחה"),
("ארנצ'יני", "כדורי ריזוטו פריכים עם פטריות וכמהין, מוצרלה וגבינת מנצ'גו, מונחים על רוטב רוזה, בלסמי מצומצם, פרמזן ובצל ירוק.", 46.00, "https://gregcafe.co.il/wp-content/uploads/2023/04/arencini.jpg", "מנות פתיחה"),
("אצבעות מוצרלה", "תיאור של אצבעות מוצרלה.", 46.00, "https://gregcafe.co.il/wp-content/uploads/2023/04/etsbaot-muzzarella.jpg", "מנות פתיחה"),
("לביבות ברוקולי", "לאבנה, סלסת עגבניות, סלטון עלים, צנונית ושמן זית.", 45.00, "https://gregcafe.co.il/wp-content/uploads/2023/04/levivot-brocolli.jpg", "מנות פתיחה"),
("פרחי כרובית", "בציפוי פריך, קרם פרש, גרידת עגבניות, סלטון עלים, שקדים קלויים ופרמזן.", 49.00, "https://gregcafe.co.il/wp-content/uploads/2023/04/pirchei-kruvit-2.jpg", "מנות פתיחה");


-- (10כריכים)
INSERT INTO Dishes (name, description, price, image_url, category)
VALUES 
('כריך מוצרלה', 'מוצרלה, פסטו, עגבניה, חציל ועלי בזיליקום.', 58.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/charich-muzzarella.jpg', 'כריכים'),
('כריך חביתה', 'חביתה, גבינת שמנת, עגבנייה, מלפפון חמוץ וחסה.', 54.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/charich-chavita.jpg', 'כריכים'),
('כריך טונה', 'סלט טונה, ביצה קשה, חסה, עגבנייה ומלפפון חמוץ.', 56.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/charich-tuna-2.jpg', 'כריכים'),
('כריך בלקני', 'פסטו, בולגרית, גבינת שמנת, פלפל וחציל קלוי. מוגש חם. *ניתן לקבל גרסה טבעונית של המנה*', 58.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/charich-balkani.jpg', 'כריכים'),
('כריך סלמון מעושן', 'סלמון מעושן, ביצה קשה, גבינת שמנת, חסה, עגבנייה ובצל ירוק.', 63.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/charich-salmon.jpg', 'כריכים'),
('טוסט גרג', 'בייגל, חמאה, גבינה צהובה, בצל, עגבנייה וביצה קשה. *ניתן לקבל גרסה טבעונית של המנה*', 53.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/toast-greg.jpg', 'כריכים'),
('טוסט גבינות יווני', 'בייגל, גבינת שמנת, גבינה צהובה, גבינה בולגרית וזיתי קלמטה. *ניתן לקבל גרסה טבעונית של המנה*', 56.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/toast-gvinot.jpg', 'כריכים'),
('טוסט אמריקאי', 'בייגל פתוח, פסטו וגבינת שמנת. מוקרם במוצרלה. *ניתן לקבל גרסה טבעונית של המנה*', 59.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/toast-americai.jpg', 'כריכים'),
('טורטייה סביח מחוזק', '...', 57.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/tortia-sabich.jpg', 'כריכים');


-- סלטים
INSERT INTO Dishes (name, description, price, image_url, category)
VALUES
(
    "סלט קינואה עדשים", 
    "מיקס קינואה ועדשים שחורות, כרוב לבן, כרוב סגול וגזר, נענע, פטרוזיליה ובזיליקום, מתובלים בשמן זית ולימון, על בסיס לאבנה, מיקס נשנושים, חמוציות וגבינת צפתית בתיבול דבש", 
    68.00, 
    "https://gregcafe.co.il/wp-content/uploads/2024/01/salat-kinoa-adashim-2.jpg", 
    "סלטים"
),
(
    "סלט קפרזה בוראטה", 
    NULL, 
    76.00, 
    "https://gregcafe.co.il/wp-content/uploads/2024/01/salat-capreza-burata.jpg", 
    "סלטים"
),
(
    "סלט יאיר", 
    NULL, 
    57.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/salat-yair.jpg", 
    "סלטים"
),
(
    "סלט טונה", 
    "טונה נקייה, ביצה קשה, תפוח אדמה ושעועית מאודים, צנונית, עגבניות שרי, מלפפון, זיתי קלמטה מונחים על חסה כרוב וגזר ומתובלים בשמן זית ולימון", 
    68.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/salat-tuna.jpg", 
    "סלטים"
),
(
    "סלט בטטה", 
    "קוביות בטטה אפויות, גבינה בולגרית מגורדת וצ'יפס בטטה, על מצע חסות, כרוב, עגבניות שרי, גזר ומלפפון. מתובל בויניגרט ותערובת גרעינים קלויים. *ניתן לקבל גרסה טבעונית של המנה", 
    67.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/salat-batata-2.jpg", 
    "סלטים"
),
(
    "סלט כרובית ועגבניות", 
    "כרובית בציפוי פריך, טחינה, בצל מטוגן, עגבנייה, עלים ירוקים, שום, שקדים וסומק", 
    68.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/salat-kruvit-agvaniot.jpg", 
    "סלטים"
),
(
    "סלט סביח מחוזק", 
    "ביצה קשה, מסבחה של גרגירי חומוס חמים, חציל וקוביות תפוחי אדמה מוקפצים בפטרוזיליה ושום מונחים על מלפפון עגבנייה בצל ופטרוזיליה קצוצים מתובלים בשמן זית ולימון מחוזק עם כדורי פלאפל וטחינה מעל. *ניתן לקבל גרסה טבעונית של המנה.", 
    69.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/salat-sabich.jpg", 
    "סלטים"
),
(
    "סלט טוסט", 
    "קוביות טוסט עם גבינה צהובה מוקפצות בחמאת שום על מצע חסות, כרוב, עגבניות שרי, גזר ומלפפון, מתובל בוויניגרט, שומשום ובולגרית מגורדת (מוגש ללא תוספת לחם). *ניתן לקבל גרסה טבעונית של המנה", 
    69.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/salat-toast.jpg", 
    "סלטים"
),
(
    "סלט בורגול ועדשים", 
    NULL, 
    69.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/salat-burgul-adashim.jpg", 
    "סלטים"
),
(
    "סלט חלומי ופטריות", 
    "קוביות גבינת חלומי, אגוזי מלך ופטריות מוקפצים בטריאקי, שום ופטרוזיליה, על מצע חסות, כרוב, עגבניות שרי, גזר ומלפפון. מתובל בוויניגרט ותערובת גרעינים קלויים", 
    74.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/salat-chalumi-pitriot.jpg", 
    "סלטים"
);

 
 
 -- (איטלקי)
INSERT INTO Dishes (name, description, price, image_url, category)
VALUES
(
    "מק אנד צ'יז", 
    "פסטה רדיאטורי ברוטב גבינות, מוקרם במוצרלה ופרמזן.", 
    57.00, 
    "https://gregcafe.co.il/wp-content/uploads/2024/01/mac-and-cheese.jpg", 
    "איטלקי"
),
(
    "קנלוני ארטישוק ירושלמי", 
    NULL, 
    76.00, 
    "https://gregcafe.co.il/wp-content/uploads/2024/01/canaloni.jpg", 
    "איטלקי"
),
(
    "פיצה בוראטה", 
    NULL, 
    84.00, 
    "https://gregcafe.co.il/wp-content/uploads/2024/01/pizza-burata.jpg", 
    "איטלקי"
),
(
    "פנה פיצה", 
    "פנה ברוטב רוזה, מוקרמת במוצרלה ואורגנו. *ניתן לקבל גרסה טבעונית של המנה.", 
    57.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/pene-pizza.jpg", 
    "איטלקי"
),
(
    "פיצה", 
    "רוטב עגבניות קלאסי, גבינת מוצרלה ו-2 תוספות לבחירה. גבינה בולגרית/עגבניות/בצל/פלפל קלוי/פטריות/זיתים ירוקים/תירס. *ניתן לקבל גרסה טבעונית של המנה.", 
    59.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/pizza-margarita.jpg", 
    "איטלקי"
),
(
    "ניוקי פטריות וערמונים", 
    "מיקס פטריות וכמהין, רוטב אלפרדו, חמאה וערמונים.", 
    59.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/nioki-armonim.jpg", 
    "איטלקי"
),
(
    "דג ים ארביאטה", 
    "פילה דג צלוי, פסטה פפרדלה, שרי שרוף, צ'ילי ירוק, קונפי שום, רוטב נפוליטנה, עלי בזיליקום ושמן זית.", 
    72.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/dag-yam-arbiata.jpg", 
    "איטלקי"
),
(
    "רביולי בטטה", 
    "חמאת שום, רוטב אלפרדו, ציר ירקות, שברי פקאן סיני, צ'יפס בטטה, בצל ירוק ופרמזן.", 
    71.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/ravioli-batata.jpg", 
    "איטלקי"
),
(
    "רביולי גבינות", 
    NULL, 
    73.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/ravioli-gvinot.jpg", 
    "איטלקי"
),
(
    "לזניה", 
    "שכבות פסטה תרד במילוי גבינות, ברוטב רוזה, מוקרם במוצרלה ופרמזן.", 
    79.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/lasania.jpg", 
    "איטלקי"
),
(
    "פפרדלה סלמון", 
    "קוביות סלמון, פפרדלה, ציר ירקות, רוטב אלפרדו, חמאת שום, ברוקולי, תרד, אפונה ושעועית ירוקה.", 
    79.00, 
    "https://gregcafe.co.il/wp-content/uploads/2023/04/papardela-salmon.jpg", 
    "איטלקי"
);


-- משקאות קרים
INSERT INTO Dishes (name, description, price, image_url, category)
VALUES
('אייס שוקו', '', 22.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/ice-shoko.jpg', 'משקאות קרים'),
('אייס וניל', '', 22.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/ice-vanile.jpg', 'משקאות קרים'),
('תות שוקולד לבן', 'מסקרפונה, אייס וניל, תותים, שוקולד לבן וקצפת.', 35.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/mushchatim-tut-shokolad-lavan.jpg', 'משקאות קרים'),
('שייק אלפחורס', 'מסקרפונה, אייס וניל, אלפחורס, ריבת חלב, קצפת וקוקוס קלוי.', 35.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/mushchatim-alfachores.jpg', 'משקאות קרים'),
('שייק קוקילידה', 'מסקרפונה, אייס וניל, עוגיית קוקי, שוקולד לוז, קצפת ולחשוב על סגירה.', 35.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/mushchatim-cookiglida.jpg', 'משקאות קרים'),
('לוטוס קפה', 'מסקרפונה, אייס וניל, אספרסו, ממרח לוטוס, עוגיות לוטוס, קצפת ושברי לוטוס.', 35.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/mushchatim-lotus-cafe.jpg', 'משקאות קרים'),
('אפוגטו', 'מסקרפונה, גלידה ואספרסו', 21.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/afugato-lotus-5.jpg', 'משקאות קרים'),
('תה קר בטעמים', 'גינגר אפרסק, לואיזה לימונית, פירות יער, ירוק סנצה, פרחי קמומיל, חמדת השקד', 14.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/tea-kar.jpg', 'משקאות קרים'),
('שוקו קר', '', 19.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/shoko-kar-1.jpg', 'משקאות קרים'),
('קפוצינו קר', 'חלב, קוביות קרח, מנת אספרסו וקצף חלב', 21.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/cafe-kar-1.jpg', 'משקאות קרים'),
('קוקטייל גן עדן', '', 23.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/דצמבר-23-517.jpg', 'משקאות קרים'),
('קפה קפוא / לייט', '', 20.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/ice-cafe-1.jpg', 'משקאות קרים'),
('צ׳אי קר', 'תה הודי מבושם עם קוביות קרח חלב, קינמון, דבש, הל וציפורן', 24.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/chai-kar-1.jpg', 'משקאות קרים'),
('גרניטה פקאן', 'קפה קפוא בתוספת פקאן סיני גרוס', 24.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/granita-pecan-1.jpg', 'משקאות קרים'),
('מילקשייק', 'שוקולד/וניל/עוגיות/ריבת חלב/סורבה. תוספת קצפת 5 ש"ח', 29.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/milkshake.jpg', 'משקאות קרים'),
('קוקיז שייק', 'מסקרפונה, אייס וניל, עוגיות אוראו, שוקולד לבן, קצפת ושברי עוגיות.', 35.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/mushchatim-oreo-1.jpg', 'משקאות קרים'),
('פיסטוק שוקולד לבן', 'מסקרפונה, אייס וניל, קרם פיסטוק שוקולד לבן, קצפת ופרורי פיסטוק', 35.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/mushchatim-fistuk-shokolad-lavan-1.jpg', 'משקאות קרים');

-- משקאות חמים
INSERT INTO Dishes (name, description, price, image_url, category)
VALUES
('אספרסו כפול/ארוך', '', 11.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/espresso-aroch.jpg', 'משקאות חמים'),
('תה עם נענע/מים עם נענע', '', 12.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/tea-nana.jpg', 'משקאות חמים'),
('שוקו חם', '', 14.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/shoko-cham.jpg', 'משקאות חמים'),
('מקיאטו', '', 9.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/makiato-katsar.jpg', 'משקאות חמים'),
('אספרסו קצר / ארוך', '', 9.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/espresso-katsar.jpg', 'משקאות חמים'),
('אספרסו כפול / ארוך', '', 11.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/espresso-kaful.jpg', 'משקאות חמים'),
('קפה שחור', '', 10.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/%E2%80%8F%E2%80%8Fshachor-%D7%A2%D7%95%D7%AA%D7%A7.jpg', 'משקאות חמים'),
('תה', '', 11.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/tea2.jpg', 'משקאות חמים'),
('אמריקנו', '', 11.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/americano-1.jpg', 'משקאות חמים'),
('תה בטעמים', 'חמדת השקד, פירות יער, קמומיל, לימונית לואיזה, תה ירוק עם נענע, ארל גריי', 12.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/tea-2.jpg', 'משקאות חמים'),
('קפוצינו', '', 14.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/hafuch-katan-1.jpg', 'משקאות חמים'),
('שוקו פרלינים', 'חלב מוקצף ופרלינים של שוקולד איכותי.', 23.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/shoko-perlinim-1.jpg', 'משקאות חמים'),
('חליטת גן עדן', 'פירות יער, תפוח, קוביות פסיפלורה, חמוציות, אננס, קוקוס, היביסקוס, לימונית ולואיזה.', 23.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/halitat-gan-eden-1.jpg', 'משקאות חמים'),
('חליטת גינגר חם', 'אננס, תפוח, קוביות גינגר, לימון, קינמון ונענע.', 23.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/halitat-ginger-1.jpg', 'משקאות חמים'),
('סיידר תפוח', 'מוגש עם מקל קינמון ותפוח. תוספת יין חם - 4 ש"ח.', 24.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/cider-3.jpg', 'משקאות חמים'),
('משקה בריאות', 'גינגר, דבש, לימון, נענע, תפוח ומקל קינמון.', 23.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/mashke-briut-1.jpg', 'משקאות חמים'),
('צ׳אי חם', 'תה הודי מבושם עם חלב, דבש, קינמון, הל וציפורן.', 24.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/chai-1.jpg', 'משקאות חמים'),
('סחלב בטעמים', 'מגוון טעמים לבחירה: סחלב הפתעות, סחלב לוטוס, סחלב אגוז לוז, סחלב פיסטוק, סחלב רגיל.', 26.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/sachlab-1.jpg', 'משקאות חמים'),
('משקה עוגיות', 'חלב חם, קרם עוגיות, שברי עוגיות, שוקולד לוז, קצפת ואגוזי לוז מסוכרים.', 35.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/mashke-oreo-1.jpg', 'משקאות חמים'),
('קינדר לוז', 'חלב חם, קרם לוז, סירופ אגוז לוז, קצפת ואגוז לוז מסוכר.', 35.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/mashke-kinder-1.jpg', 'משקאות חמים'),
('משקה פיסטוק', 'קרם פיסטוק, חלב חם, קצפת ושוקולד לוז, קצפת ופירורי פיסטוק.', 35.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/mashke-fistuk-1.jpg', 'משקאות חמים');


-- קינוחים
INSERT INTO Dishes (name, description, price, image_url, category)
VALUES
('פאי תפוחים ללא תוספת סוכר', 'פאי תפוחים וקינמון', 43.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/pai-tapuchim-lelo.jpg', 'קינוחים'),
('פאדג שוקולד', 'ליבה רכה ועשירה, מוגש עם גלידה וקצפת', 43.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/fudge_shokolad1.jpg', 'קינוחים'),
('עוגת גבינה פירורים', '', 42.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/gvina-perurim_.jpg', 'קינוחים'),
('קרם ברולה', 'קרם וניל צרפתי וסוכר שרוף', 42.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/brule.jpg', 'קינוחים'),
('מוס רושה', 'תחתית אגוזי לוז ומוס רושה מוגש עם קצפת', 43.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/ferero_roche.jpg', 'קינוחים'),
('באונטי', 'תחתית בראוניז, שכבות קוקוס ומוס שוקולד', 43.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/ugat-baunti.jpg', 'קינוחים'),
('ריבת חלב', 'עוגת ריבת חלב מוגשת עם קצפת', 44.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/ugat-ribat-chalav.jpg', 'קינוחים'),
('פאי תפוחים', 'פאי תפוחים וקינמון מוגש עם כדור גלידה', 43.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/pai-tapuchim.jpg', 'קינוחים'),
('פס רושה טבעוני', 'מוס שוקולד על שכבה של קראנץ רושה', 43.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/roche-tivoni.jpg', 'קינוחים'),
('עוגת גבינה פירורים ללא סוכר', '', 43.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/mus-gvina-lelo-sukar.jpg', 'קינוחים'),
('עוגת גבינה אפויה', '', 43.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/ugat-gvina-afuya-2.jpg', 'קינוחים'),
('קוקי-גלידה', 'עוגיות שוקולד ציפס נימוחות, גלידת שמנת, רוטב שוקולד לוז ורוטב שוקולד לבן ושערות חלווה', 43.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/cookieglida.jpg', 'קינוחים');

-- מנות עיקריות 
INSERT INTO Dishes (name, description, price, image_url, category)
VALUES
('גירוס סלמון', 'פיתה יוונית, נתחי סלמון צלוי, טחינה, סלסת פלפלים פיקנטית, עשבים ירוקים, בצל סגול, פרוסות עגבנייה, מוגש לצד ציפס', 67.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/gyros-salmon.jpg', 'מנות עיקריות'),
('דג וקארי ירוק', 'פילה דניס צלוי, אטריות דקות, כרישה, שום, זוקיני, עלים ירוקים, ברוטב קארי ירוק, כוסברה ובוטנים גרוסים', 67.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/dag-curry-yarok.jpg', 'מנות עיקריות'),
('דג צילי לימון', 'נתחי דג בטמפורה, כרוב גזר מוקפצים, בצל סגול, אצבעות זוקיני, פלפלים, שומשום ובצל ירוק, מוגש עם אורז וסלט אישי לבחירה', 69.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/dag-chilli-limon.jpg', 'מנות עיקריות'),
('תבשיל סמוסה טבעונית', 'כיסוני בצק במילוי תפו"א ובצל מטוגן, ברוקולי, שעועית ואפונה, כרישה, שום, עלים ירוקים ותרד, ברוטב קארי ירוק. מוגש עם אורז', 61.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/tavshil-samosa-tivoni.jpg', 'מנות עיקריות'),
('תבשיל סלמון בקארי', 'קוביות סלמון, מוקפצות ברוטב קארי ירוק, בצל סגול, פטריות, ברוקולי, אפונה, שעועית ירוקה, זוקיני וכוסברה, מוגש לצד אורז וסלט אישי', 79.00, 'https://gregcafe.co.il/wp-content/uploads/2024/01/curry-salmon.jpg', 'מנות עיקריות'),
('פלאפל', 'כדורי פלאפל במילוי טחינה, מוגש לצד ירקות טריים וחמוצים, סלסת פלפלים פיקנטית, משוויה טחינה מסבאחה, מוגש לצד טורטיה', 59.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/falafel-1.jpg', 'מנות עיקריות'),
('מוקפץ ירקות', 'אטריות נודלס, מוקפצות עם בצל, פלפל, זוקיני, כרוב, פטריות, שעועית ירוקה, גזר, אפונה, ברוקולי ובצל ירוק, ברוטב טריאקי ובוטנים גרוסים.', 63.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/mukpatz-noodles.jpg', 'מנות עיקריות'),
('שניצל פיש & פוטטוס', 'צונגו דג בציפוי פריך, מוגש על פוטטוס, איולי עשבי תיבול ואלף האיים, מוגש לצד סלט אישי', 67.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/fish-and-potatos-2-1.jpg', 'מנות עיקריות'),
('פאד תאי סלמון', 'אטריות אורז רחבות וקוביות סלמון מוקפצות עם בצל, פלפל, זוקיני, כרוב, פטריות, גזר, ברוקולי, שעועית ירוקה, אפונה ובצל ירוק, ברוטב פאד תאי פיקנטי, מוגש עם רבע לימון שומשום ובוטנים', 78.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/pad-thai-salmon.jpg', 'מנות עיקריות'),
('פילה דג ים', 'דג ים צרוב עם עשבי תיבול מונח על אורז, לצד סלט אישי.', 95.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/file-denis.jpg', 'מנות עיקריות'),
('סלמון עשבי תיבול', 'פילה סלמון צרוב, שום ופטרוזיליה, מוגש על לקט ירוקים וסלט אישי.', 97.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/salmon-isbei-tibul-1.jpg', 'מנות עיקריות');
-- שייקים
INSERT INTO Dishes (name, description, price, image_url, category)
VALUES
('שייק פירות על בסיס מים/חלב/מיץ תפוזים/משקה סויה/משקה שקדים/משקה שיבולת שועל', 'פירות לבחירה: מנגו, תות, מלון, אננס, בננה, תמר.', 28.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/דצמבר-23-480.jpg', 'שייק פירות'),
('שייק פירות על בסיס יוגורט', 'פירות לבחירה: מנגו, תות, מלון, אננס, בננה, תמר.', 30.00, 'https://gregcafe.co.il/wp-content/uploads/2023/04/shake-yogurt-1.jpg', 'שייק פירות');

-- Insert data into Extras table

-- רטבים (ללא הגבלה בכמות, מחיר 2 שקל)
INSERT INTO Extras (name, category, price, has_price, max_quantity) VALUES
('וויניגרט', 'רטבים', 2.00, TRUE, 999),  -- הגבלה גבוהה לייצוג שאין הגבלה
('שום שמיר', 'רטבים', 2.00, TRUE, 999),
('אלף איים', 'רטבים', 2.00, TRUE, 999),
('שמן זית', 'רטבים', 2.00, TRUE, 999),
('שמן זית לימון', 'רטבים', 2.00, TRUE, 999);

-- סלטים (כמות מקסימלית 1)
INSERT INTO Extras (name, category, price, has_price, max_quantity) VALUES
('סלט ירוק', 'סלטים', 0.00, FALSE, 1),
('סלט קצוץ', 'סלטים', 0.00, FALSE, 1),
('ללא סלט', 'סלטים', 0.00, FALSE, 1);

-- לחמים (כמות מקסימלית 1)
INSERT INTO Extras (name, category, price, has_price, max_quantity) VALUES
("ג'בטה שחורה", 'לחמים', 0.00, FALSE, 1),
('לחם קל', 'לחמים', 0.00, FALSE, 1),
('לחם ללא גלוטן', 'לחמים', 0.00, FALSE, 1),
('לחם לבן', 'לחמים', 0.00, FALSE, 1);

-- פירות (כמות מקסימלית 3)
INSERT INTO Extras (name, category, price, has_price, max_quantity) VALUES
('בננה', 'פירות', 0.00, FALSE, 3),
('מנגו', 'פירות', 0.00, FALSE, 3),
('תות', 'פירות', 0.00, FALSE, 3),
('אננס', 'פירות', 0.00, FALSE, 3),
('תמר', 'פירות', 0.00, FALSE, 3);

-- בסיס לשייק (כמות מקסימלית 1)
INSERT INTO Extras (name, category, price, has_price, max_quantity) VALUES
('על מים', 'בסיס לשייק', 0.00, FALSE, 1),
('על חלב', 'בסיס לשייק', 0.00, FALSE, 1),
('על תפוזים', 'בסיס לשייק', 0.00, FALSE, 1),
('על יוגורט', 'בסיס לשייק', 0.00, FALSE, 1),
('חלב שקדים', 'בסיס לשייק', 0.00, FALSE, 1),
('חלב סויה', 'בסיס לשייק', 0.00, FALSE, 1);

-- Adding 'רטבים' category to all breakfast dishes
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'רטבים' FROM Dishes WHERE dish_id BETWEEN 1 AND 12;

-- Adding 'סלטים' category to all breakfast dishes
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'סלטים' FROM Dishes WHERE dish_id BETWEEN 1 AND 12;

-- Adding 'לחמים' category to all breakfast dishes
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'לחמים' FROM Dishes WHERE dish_id BETWEEN 1 AND 12;


-- Adding 'סלטים' category to sandwiches from 23 to 32
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'סלטים' FROM Dishes WHERE dish_id BETWEEN 23 AND 32
ON DUPLICATE KEY UPDATE dish_id = VALUES(dish_id), extra_category = VALUES(extra_category);

-- Adding 'לחמים' category to sandwiches from 23 to 32
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'לחמים' FROM Dishes WHERE dish_id BETWEEN 23 AND 32
ON DUPLICATE KEY UPDATE dish_id = VALUES(dish_id), extra_category = VALUES(extra_category);

-- Adding 'רטבים' category to dishes from 33 to 42
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'רטבים' FROM Dishes WHERE dish_id BETWEEN 33 AND 42
ON DUPLICATE KEY UPDATE dish_id = VALUES(dish_id), extra_category = VALUES(extra_category);

-- Adding 'לחמים' category to dishes from 33 to 42
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'לחמים' FROM Dishes WHERE dish_id BETWEEN 33 AND 42
ON DUPLICATE KEY UPDATE dish_id = VALUES(dish_id), extra_category = VALUES(extra_category);

-- Adding 'סלטים' category to Italian dishes from 43 to 53
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'סלטים' FROM Dishes WHERE dish_id BETWEEN 43 AND 53
ON DUPLICATE KEY UPDATE dish_id = VALUES(dish_id), extra_category = VALUES(extra_category);

-- Adding 'פירות' category to shakes from 115 to 116
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'פירות' FROM Dishes WHERE dish_id BETWEEN 115 AND 116
ON DUPLICATE KEY UPDATE dish_id = VALUES(dish_id), extra_category = VALUES(extra_category);

-- Adding 'בסיס לשייק' category to shakes from 115 to 116
INSERT INTO Dish_Extra_Categories (dish_id, extra_category)
SELECT dish_id, 'בסיס לשייק' FROM Dishes WHERE dish_id BETWEEN 115 AND 116
ON DUPLICATE KEY UPDATE dish_id = VALUES(dish_id), extra_category = VALUES(extra_category);


