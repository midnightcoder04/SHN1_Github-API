const express = require('express');
const {GoogleGenerativeAI} = require("@google/generative-ai");
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.API_URL || 3000;
const GenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);   
const model = GenAI.getGenerativeModel({ model: "gemini-1.5-flash"})

app.use(cors({
    origin: 'https://shn-1-github-6yapiivky-midnightcoder04s-projects.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

app.post('/api/explain-readme', async (req, res) => {
    const { content, ageGroup } = req.body;
    const prompt = `Explain this readme to a ${ageGroup} : ${content}`;
    res.header('Access-Control-Allow-Origin', 'https://shn-1-github-6yapiivky-midnightcoder04s-projects.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const explanation = response.text();
        console.log('Gemini response:', explanation);
        res.json({ explanation: explanation.trim() });
    } catch (error) {
        console.error('Error during Gemini API request:', error);
        res.status(500).json({ error: 'Error generating explanation.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
