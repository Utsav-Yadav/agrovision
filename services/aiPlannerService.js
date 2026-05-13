const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function getCropPlannerInsights({ cropType, sowingDate, duration, schedule }) {
  if (!OPENAI_API_KEY) {
    console.log('AI Planner: No OPENAI_API_KEY found');
    return null;
  }

  const userPrompt = `You are an expert agronomist and crop planner. Given the following cropping details, provide a concise planning summary, three practical farming tips, and a warning about common pests or diseases for the selected crop.

Crop: ${cropType}
Sowing Date: ${sowingDate}
Duration: ${duration} days
Schedule: ${JSON.stringify(schedule, null, 2)}

Return a JSON object with keys: summary, tips, warning.`;

  try {
    console.log('AI Planner: Making API call to OpenAI');
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful agricultural planning assistant that gives practical and actionable crop management advice.'
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 350
      })
    });

    console.log('AI Planner: API response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      const message = response.status === 429
        ? 'OpenAI rate limit reached. Please wait a few moments and try again.'
        : `OpenAI API error ${response.status}: ${response.statusText}`;
      console.error('AI Planner: API error:', message, errorText);
      return { error: message };
    }

    const data = await response.json();
    console.log('AI Planner: Received data from API');

    const rawText = data?.choices?.[0]?.message?.content?.trim();
    if (!rawText) {
      console.log('AI Planner: No content in response');
      return { error: 'OpenAI returned no text response.' };
    }

    let payload;
    try {
      payload = JSON.parse(rawText);
    } catch (parseError) {
      console.log('AI Planner: Failed to parse JSON, returning raw text');
      return {
        summary: rawText,
        tips: [],
        warning: null,
        raw: rawText
      };
    }

    console.log('AI Planner: Successfully parsed response');
    return {
      summary: payload.summary || null,
      tips: Array.isArray(payload.tips) ? payload.tips : [],
      warning: payload.warning || null,
      raw: rawText
    };
  } catch (err) {
    console.error('AI Planner: Service error:', err.message);
    return null;
  }
}

module.exports = {
  getCropPlannerInsights
};
