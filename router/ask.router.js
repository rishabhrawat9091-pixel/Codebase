
import express from "express";
import axios from "axios";
import askModel from "../models/ask.model.js";

const ask = express.Router();

const requestTracker = new Map();
const MAX_REQUESTS = 5;

function checkRepeatedRequest(req, res, next) {
    const { ask: prompt } = req.body;

    if (!prompt || !prompt.trim()) {
        return res.status(400).json({
            error: "Prompt is required"
        });
    }

    const userId = req.ip;
    const normalizedPrompt = prompt.trim().toLowerCase();
    const key = `${userId}:${normalizedPrompt}`;

    let count = requestTracker.get(key) || 0;
    count++;

    requestTracker.set(key, count);

    if (count >= MAX_REQUESTS) {
        return res.status(429).json({
            message: "You are blocked from sending this same request.",
            attempts: count
        });
    }

    next();
}

ask.post("/ask", checkRepeatedRequest, async (req, res) => {
    try {
        const { ask: prompt } = req.body;

        const response = await axios.post(
            "http://localhost:11434/api/chat",
            {
                model: "qwen3:4b",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                stream: false
            }
        );

        const askdata = new askModel({
            ask: prompt,
            answer: response.data.message.content,
            duration: response.data.total_duration
        });

        // await askdata.save();

        return res.status(200).json({
            message: "Data is saved",
            answer: response.data.message.content,
            duration: response.data.total_duration
        });

    } catch (error) {
        console.error("Error:", error.message);

        return res.status(500).json({
            error: "Something went wrong",
            details: error.message
        });
    }
});

export default ask;
