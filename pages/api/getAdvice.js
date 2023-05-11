import axios from 'axios';

async function handler(req, res) {
  const { weatherData } = req.body;

  if (weatherData) {
    try {
      const openaiResponse = await axios.post(
        'https://https://openai-weather.vercel.app/api/advice',
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
