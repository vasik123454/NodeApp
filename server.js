require('dotenv').config()

const express = require('express')
const app = express()
const fs = require('fs')
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
app.use(express.json())
app.use(express.static('public'))


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const storeItems = new Map([
    [1, { priceInCents: 400000, name: "Escape 60"}]
])

app.get('/store', function(req, res) {
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
        res.render('store.ejs', {
          stripePublicKey: stripePublicKey,
          items: JSON.parse(data)
        })
      }
    })
  })
  
  app.get('/kontakt', function(req, res) { 
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
        res.render('kontakt.ejs', {
          stripePublicKey: stripePublicKey,
          items: JSON.parse(data)
        })
      }
    })
  })
  
  app.get('/about', function(req, res) { 
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
        res.render('about.ejs', {
          stripePublicKey: stripePublicKey,
          items: JSON.parse(data)
        })
      }
    })
  })

  app.post('/purchase', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            shipping_rates: ['shr_1JgTjtBN3DzrtruvLCLOlhNa'],
            shipping_address_collection: {
                allowed_countries: ['CZ'],
                },
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: 'czk',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents,
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.SERVER_URL}`,
            cancel_url: `${process.env.SERVER_URL}`
        })
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }  

  })

  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });


