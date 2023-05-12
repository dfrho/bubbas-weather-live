import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);

async function handler(req, res) {
  const { weatherData } = req.body;

  if (weatherData) {
    const prompt = `In the voice of Willard Scott without saying so, and based on current weather described as ${weatherData.current.condition.text} and weather conditions consisting of Cloud Coverage is ${weatherData.current.cloud}% and Temperature is ${weatherData.current.temp_f}F and Humidity is ${weatherData.current.humidity}% and Precipitation today is ${weatherData.current.precip_in} inches and Current Wind Speed is ${weatherData.current.wind_mph} mph and Winds are Gusting at ${weatherData.current.gust_mph} mph, any advice on what a web user looking at your response in a pop up window, should pack for the day, as in outerwear, sunglasses, and/or an umbrella?`;
    try {
      const { data } = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 0.9,
        max_tokens: 50,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: '\\n',
      });
      const advice = data.choices[0].text.trim();
      res.status(200).json({ advice });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'An error occurred while fetching advice' });
    }
  } else {
    res.status(400).json({ message: 'Invalid request data' });
  }
}

export default handler;
