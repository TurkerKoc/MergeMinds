# FullStack Social Media App

Build a COMPLETE Fullstack Responsive MERN App with Auth, Likes, Dark Mode | React, MongoDB, MUI

Video: https://www.youtube.com/watch?v=K8YELRmUb5o

For all related questions and discussions about this project, check out the discord: https://discord.gg/2FfPeEk2mX

# Stripe

Visit the page for stripe installation https://stripe.com/docs/stripe-cli

## npm installation

In client run the following command :
* npm i @stripe/stripe-js

In server run the following command :
* npm install --force stripe


## Credentials

Add following env variables to .env file in server

* CLIENT_URL='http://localhost:3000'
* STRIPE_SECRET_KEY='sk_test_51NIDePFeAkHftgQCfqsr9edAb9j1pZI6lCP3m618Bkxc07WRvdG8vmrH5hLqxI3vq2KTVtWcb8bW1qbX4lF0PjnB00viASdhSL'
* STRIPE_WEBHOOK_SECRET='whsec_0c57272d3b7a43cf59b9369c36f2b9f0d4a64ec8ecba4327490a33517bd01f28'

## Start Stripe

After installed the stripe cli, logged in. By using the following command:
* stripe login --inactive

Run this command to start stripe endpoint : 
* stripe listen --forward-to localhost:3001/stripe/webhook

