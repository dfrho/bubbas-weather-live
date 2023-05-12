import axios from 'axios';

export default async function handler(req, res) {
  const { ipAddress } = req.query;
  console.log(
    '🚀 ~ file: getWeatherData.js:5 ~ handler ~ ipAddress:',
    ipAddress
  );

  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_APIKEY}&q=${ipAddress}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching weather data' });
  }
}
