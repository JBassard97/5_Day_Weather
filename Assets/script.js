// EVERYTHING wrapped in document ready function
$(document).ready(function () {
  // Declaring variables GLOBALLY
  const weatherApiKey = "c31562d6228b1fc62e779b033e352bc0";
  // const weatherApiUrl = "api.openweathermap.org/data/2.5/forecast?q=durham";
  // const openWeatherApiUrl = "api.openweathermap.org/data/2.5/forecast?q=`${userCurrentCity}`&appid=`${weatherApiKey}`";
  // Geo JS
  const geoJsApiUrl = "https://get.geojs.io/v1/ip/geo.json";

  // Declaring today's date and future 5 days
  const today = dayjs();
  const day1Display = today.add(1, "day").format("M/D");
  $("#day-1").text(day1Display);
  const day2Display = today.add(2, "day").format("M/D");
  $("#day-2").text(day2Display);
  const day3Display = today.add(3, "day").format("M/D");
  $("#day-3").text(day3Display);
  const day4Display = today.add(4, "day").format("M/D");
  $("#day-4").text(day4Display);
  const day5Display = today.add(5, "day").format("M/D");
  $("#day-5").text(day5Display);

  // Grabbing form elements
  const citySearchForm = $("#city-search");
  const locationInput = $("#location-input");
  const searchButton = $("#search-button");

  // Grabbing current display elements
  const cityNameDisplay = $("#city-name");
  const currentDateDisplay = $("#current-date");
  currentDateDisplay.text(" (" + today.format("dddd, MMMM D") + ")");
  const currentEmojiDisplay = $("#weather-emoji-0");
  const tempDisplay = $("#temp-0");
  const windDisplay = $("#wind-0");
  const humidDisplay = $("#humid-0");

  fetchCurrentGeoData();

  function fetchCurrentGeoData() {
    fetch(geoJsApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        const userCurrentCity = data.city;
        var userCurrentState = data.region;
        console.log(
          "Hello User! You're currently in " +
            userCurrentCity +
            ", " +
            userCurrentState +
            "!"
        );
        cityNameDisplay.text(userCurrentCity);
        fetchCurrentWeather(userCurrentCity);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function fetchCurrentWeather(userCurrentCity) {
    // This url gets ONLY the current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCurrentCity}&appid=${weatherApiKey}&units=imperial`;

    fetch(currentWeatherUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const currentIconCode = data.weather[0].icon;
        var currentTemp = Math.round(data.main.temp);
        var currentWind = Math.round(data.wind.speed);
        var currentHumidity = Math.round(data.main.humidity);
        var cityName = userCurrentCity;
        displayCurrentWeather(
          currentIconCode,
          currentTemp,
          currentWind,
          currentHumidity
        );
        fetchForecastByCity(cityName);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function displayCurrentWeather(
    currentIconCode,
    currentTemp,
    currentWind,
    currentHumidity
  ) {
    console.log(currentIconCode);

    // This link gives us access to all icons from OpenWeather dynamically!
    currentEmojiDisplay.attr(
      "src",
      `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`
    );
    tempDisplay.text(currentTemp);
    windDisplay.text(currentWind);
    humidDisplay.text(currentHumidity);
  }

  function fetchForecastByCity(cityName) {
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherApiKey}&units=imperial`;

    fetch(forecastWeatherUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        forecastArray = data.list.slice(0, 6);
        console.log(
          "Here's a peek at the forecasted data for that area! \n",
          forecastArray
        );
        displayForecastWeather(forecastArray);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function displayForecastWeather(forecastArray) {
    for (i = 0; i < forecastArray.length; i++) {
      // console.log(forecastArray[i]);

      const forecastIconCode = forecastArray[i].weather[0].icon;
      const forecastTemp = Math.round(forecastArray[i].main.temp);
      const forecastWind = Math.round(forecastArray[i].wind.speed);
      const forecastHumid = Math.round(forecastArray[i].main.humidity);

      var allIconDisplays = $(`#weather-emoji-${[i]}`);
      var allTempDisplays = $(`#temp-${[i]}`);
      var allWindDisplays = $(`#wind-${[i]}`);
      var allHumidDisplays = $(`#humid-${[i]}`);

      allTempDisplays.text(forecastTemp);
      allWindDisplays.text(forecastWind);
      allHumidDisplays.text(forecastHumid);
      allIconDisplays.attr(
        "src",
        `https://openweathermap.org/img/wn/${forecastIconCode}@2x.png`
      );
    }
  }
});
