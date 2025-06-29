const express = require('express');
const mongoose = require('./config/db');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const Transaction = require('./models/transaction');

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: true }));
app.use(cookieParser())
app.use(express.static('public'));
app.get('/',(req,res)=>{
res.render("index");
})

app.post('/webhook', express.json(), async(req, res) => {
    const event = req.body;
    switch (event.event) {
      case 'subscription.create':
        console.log('✅ Subscription created:', event.data);
        // Save subscription info to DB
        break;
  
      case 'invoice.create':
        console.log('🧾 Invoice created:', event.data);
        break;
  
      case 'invoice.payment_failed':
        console.log('❌ Payment failed:', event.data);
        break;
  
      case 'invoice.payment_succeeded':
        console.log('✅ Recurring payment successful:', event.data);
        // Update user’s subscription status
        case 'charge.success':
           // console.log('✅ Recurring payment successful:', event.data);
           console.log(event.data.reference)
           await new Promise(resolve => setTimeout(resolve, 60000));
         let t =  await Transaction.findOne({reference:event.data.reference})
         console.log(t)
           t.status="Paid", 
           t.amount=event.data.amount
          
           await t.save()
        break;
  
      default:
        console.log('Unhandled event:', event.event);
    }
  
    res.sendStatus(200);
  });
app.use('/', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
