const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://afrirewards:Afri12345Rewards@afrirewards.da6lul0.mongodb.net/saloon", { useNewUrlParser: true, useUnifiedTopology: true });
module.exports = mongoose;
