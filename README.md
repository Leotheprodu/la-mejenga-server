# Cuenta Clara Server Documentation

This is a project made with Node.js, Express.js and Mysql for the backend. This project is a documentation for the Cuenta Clara Project, it's an application that will allow you to control when a client buy/pay a product/service, the application will allow you to control the inventory, the clients, the products, the services, the sales, the expenses, the incomes, the taxes, the reports, the payments, the debts, the credits, and let your client check the status of their orders, invoices, payment options, and much more.. This project is made by Leonardo Serrano Alfaro (@Leotheprodu). Currently is in development.

## Getting Started

Install All Dependencies and uptade the .env file with your own credentials:

```bash
URL_CORS=yourCorsOriginURL
FRONTEND_DOMAIN=yourFrontendDomainLike:http://localhost:3000
EMAIL_HOST=yourEmailHost
EMAIL_USER=yourEmailUser
EMAIL_PASS=yourEmailPassword
SECRET_EXPRESS_SESSION=yourSecretExpressSession
DB_USER=YourDBUser
DB_PASSWORD=YourDBPassword
DB_NAME=NameOfYourDB
DB_HOST=localhost
DB_PORT=3306
INITIAL_BALANCE=amount of free balance for new users(like 0)

```

`DB_*` are for the database connection so it's the most important part of the .env file

After doing that, u can create manually the database using the de information of models folder:
`/models/mysql`
We used Sequelize for the models so u can sync the models with the database using the sync function made for sync all the models with the database, I made a funciotion called dbSync in:
`/config/mysql.js`
just import the function in the app.js file and it will create all tables in the database, after that u can run the server and it will create all the tables in the database.

Ok Ready to go, you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.
