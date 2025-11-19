# API Test Cases for Code Mastery Platform

Цей документ містить тестові сценарії для перевірки основних функцій API: реєстрації, авторизації та отримання даних про курс.

## Тестове оточення
* **Інструмент тестування:** Postman
* **Формат даних:** JSON

---

## TC-01: Реєстрація нового користувача

* **Опис:** Перевірка можливості створення нового облікового запису студента/викладача.
* **Метод:** `POST`
* **URL:** `/sign-up`

| Етап | Дані |
| :--- | :--- |
| **Тіло запиту (Request Body)** | ```{ "email": "test@gmail.com", "password": "12345678Aa", "first_name": "John", "last_name": "Doe", "role": "student" }``` |
| **Очікуваний результат** | **Status:** 201 Created **Body:** JSON з повідомленням про успішну реєстрацію. |
| **Фактичний результат** | **Status:** 201 Created **Body:**```{ "message": "User registered successfully"}``` |
| **Статус тесту** | ✅ **PASSED** |

---

## TC-02: Авторизація користувача

* **Опис:** Перевірка входу в систему з валідними даними.
* **Метод:** `POST`
* **URL:** `/sign-in`

| Етап | Дані |
| :--- | :--- |
| **Тіло запиту (Request Body)** | ```{ "email": "test@gmail.com", "password": "12345678Aa"}``` |
| **Очікуваний результат** | **Status:** 201 Created (або 200 OK) **Body:** Повідомлення про успішний вхід або JWT токен. |
| **Фактичний результат** | **Status:** 201 Created **Body:**```{ "message": "Logged in successfully"}``` |
| **Статус тесту** | ✅ **PASSED** |

---

## TC-03: Отримання інформації про курс

* **Опис:** Перевірка отримання детальної інформації про конкретний курс за його ID.
* **Метод:** `GET`
* **URL:** `/course/34`

| Етап | Дані |
| :--- | :--- |
| **Тіло запиту** | *Відсутнє (параметр передається в URL)* |
| **Очікуваний результат** | **Status:** 200 OK **Body:** Об'єкт JSON з даними курсу (ID, назва, опис, автор). |
| **Фактичний результат** | **Status:** 200 OK **Body:**```{ "course": {       "course_id": 34,       "name": "Java Fundamentals",       "description": "Comprehensive Java course.",       "instructors": "John Doe, Jane Smith",       "price": "59.99",       "duration": 45,       "level": "Intermediate",       "image": "http://localhost:3001/uploads/java.webp",       "author": {           "user_id": 6,           "email": "email@x.com",           "password": "$2b$10$1306OB1PNXoNhCjgoRWev.3oU6uQejfETcH6T4cNdltPb8ziPRTyy",           "role": "teacher",           "avatar_url": "uploads/1714551553896.jpg",           "first_name": "Name",           "last_name": "Surname"       },       "lessons": [],       "isAuthor": false,       "isBought": false   },   "lessons": []}``` |
| **Статус тесту** | ✅ **PASSED** |
