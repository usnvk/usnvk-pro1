const Food = require('../models/food');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The main function that handles the entire diet chart generation process.
exports.generateDietChart = async (req, res) => {
    try {
        const { gender, age, weight, height, activityLevel, vegOrNonveg, prakriti, healthGoal, allergies, specificConcerns } = req.body;
        console.log('Received data from frontend:', req.body);

        // Step 1: Query the database for a list of suitable foods based on dietary type and allergies.
        const foodQuery = {};
        if (vegOrNonveg === 'vegetarian') {
            foodQuery.isVegetarian = true;
        } else {
            foodQuery.isNonVegetarian = true;
        }

        if (allergies && allergies.length > 0) {
            const allergyArray = allergies.split(',').map(item => item.trim());
            foodQuery.allergens = { $nin: allergyArray };
        }
        console.log('Constructed MongoDB query:', foodQuery);

        const filteredFoods = await Food.find(foodQuery).limit(100);
        console.log(`Found ${filteredFoods.length} foods in the database.`);

        let prompt;

        // Step 2: Conditional logic to build the prompt based on database analysis.
        if (filteredFoods.length === 0) {
            // SCENARIO A: No food data found in the database. Rely on AI's knowledge.
            console.log('Database is empty or no foods match criteria. Generating diet chart using AI knowledge.');
            
            prompt = `
                You are an expert Ayurvedic dietitian. Your task is to generate a comprehensive, single-day diet plan tailored to a patient. The plan must be nutritionally sound and strictly follow Ayurvedic principles, including the six tastes and properties (Hot/Cold, Easy/Difficult to Digest).

                Patient Details:
                - Gender: ${gender}
                - Age: ${age}
                - Weight: ${weight} kg
                - Height: ${height} cm
                - Activity Level: ${activityLevel}
                - Health Goal: ${healthGoal}
                - Ayurvedic Prakriti (Dosha): ${prakriti}
                - Diet Type: ${vegOrNonveg}
                - Specific Health Concerns: ${specificConcerns}

                The diet chart must include:
                - Meal-by-meal plans (Breakfast, Lunch, Dinner, and 2-3 Snacks) for a single day.
                - Each food item's name, quantity, and its Ayurvedic properties (e.g., Hot/Cold, Easy/Difficult to Digest).
                - The six tastes for each meal (Sweet, Sour, Salty, Bitter, Pungent, Astringent).
                - A brief, concise explanation (1-2 sentences) of why the plan is suitable for their specific Dosha.

                Respond with a valid JSON object. The JSON should have a 'diet_plan' key, which is an object with 'day' and 'meals' keys. Each meal is an object with 'meal_time', 'tastes', 'explanation', and 'items' (an array of food objects with name, quantity, and properties).
            `;
        } else {
            // SCENARIO B: Food data is present in the database. Use it to generate a precise diet chart.
            const foodListString = filteredFoods.map(food => 
                `Name: ${food.name}, Properties: ${food.properties.join(', ')}, Tastes: ${food.tastes.join(', ')}`
            ).join('\n');

            prompt = `
                You are an expert Ayurvedic dietitian. Your task is to generate a comprehensive, single-day diet plan tailored to a patient. The plan must be nutritionally sound and strictly follow Ayurvedic principles, including the six tastes and properties (Hot/Cold, Easy/Difficult to Digest).

                Patient Details:
                - Gender: ${gender}
                - Age: ${age}
                - Weight: ${weight} kg
                - Height: ${height} cm
                - Activity Level: ${activityLevel}
                - Health Goal: ${healthGoal}
                - Ayurvedic Prakriti (Dosha): ${prakriti}
                - Diet Type: ${vegOrNonveg}
                - Specific Health Concerns: ${specificConcerns}

                To create the plan, use only the following list of suitable foods from our database. Analyze their properties and tastes to create a precise diet chart.

                Available Foods:
                ${foodListString}

                The diet chart must include:
                - Meal-by-meal plans (Breakfast, Lunch, Dinner, and 2-3 Snacks) for a single day.
                - Each food item's name, quantity, and its Ayurvedic properties (e.g., Hot/Cold, Easy/Difficult to Digest).
                - The six tastes for each meal (Sweet, Sour, Salty, Bitter, Pungent, Astringent).
                - A brief, concise explanation (1-2 sentences) of why the plan is suitable for their specific Dosha.

                Respond with a valid JSON object. The JSON should have a 'diet_plan' key, which is an object with 'day' and 'meals' keys. Each meal is an object with 'meal_time', 'tastes', 'explanation', and 'items' (an array of food objects with name, quantity, and properties).
            `;
        }

        // Step 3: Call the Gemini AI API with the constructed prompt.
        console.log('Sending prompt to Gemini API...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
        let result, responseText;
        try {
            result = await model.generateContent(prompt);
            console.log('Full Gemini API result:', JSON.stringify(result, null, 2));
            responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log('Raw AI Response:', responseText);
        } catch (aiError) {
            console.error('❌ AI API Error:', aiError);
            return res.status(500).json({ error: 'Failed to get a response from Gemini AI API. Check your API key, network connection, and see backend logs for details.' });
        }

        if (!responseText) {
            console.error('❌ AI API returned no response. Full result:', JSON.stringify(result, null, 2));
            return res.status(500).json({ error: 'Gemini AI API did not return a response. Please check your API key, quota, or try again later. See backend logs for details.' });
        }

        let dietChartData;
        try {
            const cleanedText = responseText.replace(/```json|```/g, '').trim();
            dietChartData = JSON.parse(cleanedText);
        } catch (jsonError) {
            console.error('❌ JSON Parsing Error:', jsonError.message);
            return res.status(500).json({ error: 'Failed to parse AI response. The model may have returned invalid JSON. Check the backend console for the raw response.' });
        }

        // Step 4: Send the final, generated diet chart back to the frontend.
        res.json(dietChartData);

    } catch (error) {
        console.error('❌ Error generating diet chart:', error.message);
        res.status(500).json({ error: 'Failed to generate diet chart. Check the backend console for details.' });
    }
};
