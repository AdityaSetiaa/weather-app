const weatherForm = document.querySelector(".input-weather");
const cityInput = document.querySelector(".input");
const card = document.querySelector(".card");
const apiKey = "c74ae5dd629ba1d20735430513510b02";

const vids = {
  sunny: { source: "sunny.mp4", type: "video/mp4" },
  cloud: { source: "cloud.mp4", type: "video/mp4" },
  thunder: { source: "thunder.mp4", type: "video/mp4" },
  snow: { source: "snow.mp4", type: "video/mp4" },
  fog: { source: "fog.mp4", type: "video/mp4" },
  rain: { source: "rain.mp4", type: "video/mp4" }
};

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);

      displayWeatherInfo(weatherData);
      displayBackgroundVideo(weatherData.weather[0].id);
    } catch (error) {
      console.error(error);

      displayError(error);
    }
  } else {
    displayError("Please enter a city");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }

  return await response.json();
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${(temp - 273.15).toFixed(2)}°C`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.textContent = getWeatherEmoji(id);

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️" ; 
    case weatherId >= 300 && weatherId < 400:
      return "🌧️"; 
    case weatherId >= 500 && weatherId < 600:
      return "🌧️";
    case weatherId >= 600 && weatherId < 700:
      return "❄️" ; 
    case weatherId >= 700 && weatherId < 800:
      return "🌫️" ; 
    case weatherId === 800:
      return "☀️" ;  
    case weatherId >= 801 && weatherId < 810:
      return "☁️" ; 
  }
}

function getWeatherVideo(weatherId) {
  if (weatherId >= 200 && weatherId < 300) {
    return  vids.thunder;
  } else if (weatherId >= 300 && weatherId < 400) {
    return vids.rain;
  } else if (weatherId >= 500 && weatherId < 600) {
    return   vids.rain;
  } else if (weatherId >= 600 && weatherId < 700) {
    return  vids.snow;
  } else if (weatherId >= 700 && weatherId < 800) {
    return   vids.fog;
  } else if (weatherId === 800) {
    return   vids.sunny;
  } else if (weatherId >= 801 && weatherId < 810) {
    return  vids.cloud;
  } else {
    return null;
  }
}

function displayBackgroundVideo(weatherId) {
  const videoData = getWeatherVideo(weatherId);

  if (videoData) {
    console.log("Changing video to: ", videoData.source);

    const videoElement = document.createElement("video");

    videoElement.src = videoData.source;
    videoElement.type = videoData.type;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.classList.add("bg-video");

    const existingVideo = document.querySelector("video.bg-video");
    if (existingVideo) {
      console.log("Removing existing video...");
      existingVideo.remove();
    }

    const body = document.querySelector("body");
    body.appendChild(videoElement);
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");

  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  
  card.appendChild(errorDisplay);
}
