import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import styles from './index.module.css';
import 'react-tooltip/dist/react-tooltip.css';

const WeatherTable = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [advice, setAdvice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ipAddress = ipResponse.data.ip;
        const weatherResponse = await axios.get(
          `/api/getWeatherData?ipAddress=${ipAddress}`
        );
        setWeatherData(weatherResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const onClick = () => {
    setIsModalOpen(true);
    setTimeout(() => setIsModalOpen(false), 400);
  };

  useEffect(() => {
    let cancel;

    const getAdvice = async () => {
      if (weatherData !== null) {
        try {
          const response = await axios.post(
            '/api/getAdvice',
            { weatherData },
            {
              cancelToken: new axios.CancelToken((c) => (cancel = c)),
            }
          );
          const advice = response.data.advice;
          setAdvice(advice);
        } catch (error) {
          console.error(error);
        }
      }
    };

    getAdvice();

    return () => {
      if (typeof cancel === 'function') {
        cancel();
      }
    };
  }, [weatherData]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container">
      {weatherData ? (
        <div className={styles.main}>
          <div className={styles.card}>
            <div className={styles['weather-status']}>
              <h3 className={styles.title}>
                {`Current Weather in ${weatherData.location.name} is
            ${capitalizeWords(weatherData.current.condition.text)}`}
              </h3>
              {advice ? (
                <>
                  {!isModalOpen && (
                    <Tooltip id="my-tooltip" place="top" effect="solid" />
                  )}
                  <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="AI advice on what to pack"
                    onClick={() => setIsModalOpen(true)}
                    className={`${styles['weather-button']} ${
                      advice && 'advice-available'
                    }`}
                  >
                    <img
                      className={styles['weather-icon']}
                      src={`https:${weatherData.current.condition.icon}`}
                      alt={weatherData.current.condition.text}
                    />
                  </button>
                </>
              ) : (
                <img
                  className={styles['weather-icon']}
                  src={`https:${weatherData.current.condition.icon}`}
                  alt={weatherData.current.condition.text}
                />
              )}
            </div>

            <ul className={styles.description}>
              <li>{`Cloud coverage is ${weatherData.current.cloud}%`}</li>
              <li>{`Temperature is ${weatherData.current.temp_f}F/${weatherData.current.temp_c}C`}</li>
              <li>{`It feels like ${weatherData.current.feelslike_f}F/${weatherData.current.feelslike_c}C`}</li>
              <li>{`Humidity is ${weatherData.current.humidity}%`}</li>
              <li>{`Visibility is at ${weatherData.current.vis_miles} miles`}</li>
              <li>{`Current wind speed is ${weatherData.current.wind_mph} mph`}</li>
              {weatherData.current.gust_mph > 8 && (
                <li>{`Winds are gusting at ${weatherData.current.gust_mph} mph`}</li>
              )}
              <li>{`Wind direction is ${weatherData.current.wind_dir}`}</li>
            </ul>
          </div>

          {isModalOpen && (
            <div className={styles['modal-overlay']} onClick={closeModal}>
              <div className={styles['modal-advice']}>
                <button className={styles['close-button']} onClick={closeModal}>
                  X
                </button>
                <div>
                  <h3>How to Pack</h3>
                  <p>{advice}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

function Home() {
  return (
    <div className="Home">
      <WeatherTable></WeatherTable>
    </div>
  );
}

export default Home;
