const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//link to AI Gemini
//set prompt
//set default routing
//do error

const getAiResponse = async (userMessage) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const prompt = `You are a helpful customer support AI for "Orange Book". Respond concisely and professionally to user queries. If the user mentions "support" or asks for human help, always recommend typing "support" to connect with a human agent. Do not provide contact details or external links.

        User: ${userMessage}
        AI:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;

    } catch (error) {
        console.error("Error getting AI response:", error);
       
        return "Sorry Im currently unable to provide a response. Please try again later";
    }
};

module.exports = {
    getAiResponse
};