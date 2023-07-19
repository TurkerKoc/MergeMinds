# MergeMinds 


<div style="display: flex; justify-content: center;">
  <img src="https://i.postimg.cc/RZ8rGWjb/M-M.png" alt="Image" />
</div>

The idea behind the MergeMinds is to create a platform that connects individuals who want to start a start-up based on their skills and ideas. For example, a person with a start-up idea but lacking technical expertise can post an advertisement on our website, seeking skilled developers such as backend and frontend developers. Conversely, individuals with the required skills can also reach out to people with promising ideas.

We believe that our web application can facilitate and promote collaboration among talented individuals, leading to the formation of dynamic teams and the birth of innovative start-ups. The key difference from the existing job-searching websites is that in our case company does not exists yet and we are trying to gather ambitious people together to come up with companies that can change the world.

## Introduction

This project is a template for building fullstack JavaScript applications running on node.js. The technology stack is as follows:
- **React** for the front-end
- **express.js** for the server
- **mongodb** for the database

To get started, the application is currently running on localhost, providing you with a local environment for development and testing.

## Get Started
The package.json provides all the commands needed to test and run this application.
- **npm install** install all dependencies for the server and the client.
- **npm start** starts the complete MERN app.

### Step 1 - Dependicies
First you need to install dependecies for both frontend and backend by using the command metioned above.
```
mergeminds/backend:$ npm install
mergeminds/frontend:$ npm install
```

### Step 2 - Stripe
After successfully installed the dependicies, you also need to install **stripe** API to have payment functionality on the website. You can follow those steps given below. 

#### Install Stripe Cli
You can visit the page for stripe cli installation https://stripe.com/docs/stripe-cli

#### Start the Stripe Server
After installed the stripe cli, You first need to login.
* ```stripe login --interactive```

After successfully logged in. Run this command to start stripe server: 
* ```stripe listen --forward-to localhost:3001/stripe/webhook```


### Step 3 - Configurations

Before running the app you also need to define your configurations by using **.env** file created in backend. You can use the following credentials/configurations to run our app. 

#### Credentials

Add following env variables to .env file in backend

* PORT = 3001
* MONGO_URL = "mongodb+srv://turkerkoc:asd123@mernapp.xogfrl4.mongodb.net/?retryWrites=true&w=majority"
* JWT_SECRET="mergemindsebass23"
* CLIENT_URL="http://localhost:3000"
* STRIPE_SECRET_KEY='sk_test_51NIDePFeAkHftgQCfqsr9edAb9j1pZI6lCP3m618Bkxc07WRvdG8vmrH5hLqxI3vq2KTVtWcb8bW1qbX4lF0PjnB00viASdhSL'
* STRIPE_WEBHOOK_SECRET='whsec_0c57272d3b7a43cf59b9369c36f2b9f0d4a64ec8ecba4327490a33517bd01f28'
