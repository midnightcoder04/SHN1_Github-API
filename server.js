const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/explain-readme', async (req, res) => {
    const { content, ageGroup } = req.body;
    const prompt = `Explain this readme to a ${ageGroup} year old: ${content}`;
    
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ]
        });
        console.log('OpenAI response:', response);
        res.json({ explanation: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error during OpenAI API request:', error);
        res.status(500).json({ error: 'Error generating explanation.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
