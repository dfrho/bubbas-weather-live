import axios from 'axios';
import microCors from 'micro-cors';
// TODO: microCors disables cors in development, but production mode removes the need for the cors package

const cors = microCors({
  allowMethods: ['POST', 'OPTIONS'], // Add OPTIONS to the array
  allowHeaders: ['Content-Type'],
  origin: 'http://localhost:3000',
});

async function handler(req, res) {
  const { weatherData } = req.body;

  if (weatherData) {
    try {
      const openaiResponse = await axios.post(
        'https://openai-weather-7bezhl2tn-dfrho.vercel.app/api/advice',
        {
          prompt: `In the voice of Willard Scott without saying so, and based on last update at ${weatherData.location.localtime} and weather conditions consisting of Cloud Coverage is ${weatherData.current.cloud}% and Temperature is ${weatherData.current.temp_f}F and Humidity is ${weatherData.current.humidity}% and Precipitation today is ${weatherData.current.precip_in} inches and Current Wind Speed is ${weatherData.current.wind_mph} mph and Winds are Gusting at ${weatherData.current.gust_mph} mph, any advice on what a web user looking at your response in a pop up window, should pack for the day, as in outerwear, sunglasses, and/or an umbrella?`,
          stop: ['\\n'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const advice = openaiResponse.data.choices[0].text.trim();
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, PUT, POST, DELETE, OPTIONS'
      );
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

export default cors(handler);
