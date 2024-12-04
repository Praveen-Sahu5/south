require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; 
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/referralDB'; 


app.use(bodyParser.json());
app.use(cors());


mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));


const referralSchema = new mongoose.Schema({
    id: String,
    clientName: String,
    clientCell: String,
    clientEmail: String,
    companyName: String,
    price: Number,
    containers: Number,
    town: String,
    details: String,
    date: { type: Date, default: Date.now },
});

const Referral = mongoose.model('Referral', referralSchema);


app.post('/api/referrals', async (req, res) => {
    try {
        const referral = new Referral(req.body);
        await referral.save();
        res.status(201).send('Referral saved successfully');
    } catch (error) {
        res.status(500).send('Error saving referral: ' + error.message);
    }
});


app.get('/api/referrals', async (req, res) => {
    try {
        const referrals = await Referral.find();
        res.json(referrals);
    } catch (error) {
        res.status(500).send('Error fetching referrals: ' + error.message);
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
