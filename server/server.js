const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 CORS FIX: Allow All Origins 🔥
// Ye bata raha hai ki "Koi bhi website (origin: *) request bhej sakti hai"
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Debugging: Check API Key
if (!process.env.NVIDIA_API_KEY) {
    console.error("❌ ERROR: NVIDIA_API_KEY is missing in .env file!");
}

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

app.post('/explain', async (req, res) => {
    const { code, language } = req.body;
    
    console.log(`\n🔹 Analyzing request for: ${language}`);

    const systemPrompt = `You are a Principal Software Architect and Runtime Environment Simulator.
    
    YOUR GOAL: Trace the execution of the code line-by-line as if you are the CPU/Interpreter.
    
    ⛔ STRICT RULES:
    1. NO SUMMARIES ("This code does X"). Start tracing immediately.
    2. NO VAGUE TALK. Be technical.
    3. EXPLAIN "WHY" and "HOW" data moves.
    
    ✅ REQUIRED OUTPUT FORMAT:
    
    ### ⚡ Execution Trace (Runtime Flow)
    1. **Initialization**: [Explain variables loading into memory]
    2. **Line [X]**: [Explain the execution step. E.g., "The event listener attaches to the DOM..."]
    3. **Data Mutation**: [Explain how variables change value]
    
    ### 🧠 Deep Dive: Architecture
    - Explain the most complex logic (Recursion, API calls, State Management).
    - If libraries (React, Express) are used, explain their internal role.
    
    |||SPLIT|||
    
    ### 🛡️ Optimization & Security
    1. **Performance**: [Identify bottlenecks]
    2. **Security**: [Identify leaks or validation errors]
    3. **Refactored Code**: [Provide a cleaner version of the worst function]
    
    Tone: Senior Engineer to Engineer.
    Language: ${language}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "meta/llama-3.1-405b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Trace this code execution:\n\n${code}` }
            ],
            temperature: 0.1,
            top_p: 0.8,
            max_tokens: 2500,
            stream: false
        });

        const rawContent = completion.choices[0].message.content;
        
        const parts = rawContent.split('|||SPLIT|||');
        const explanation = parts[0] ? parts[0].trim() : "Analysis failed.";
        const suggestions = parts[1] ? parts[1].trim() : "No suggestions provided.";

        res.json({ explanation, suggestions });

    } catch (error) {
        console.error("❌ BACKEND ERROR:", error.message);
        res.status(500).json({ error: "Analysis failed.", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});