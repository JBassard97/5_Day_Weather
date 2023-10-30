// EVERYTHING wrapped in document ready function
$(document).ready(function () {
  // Declaring variables GLOBALLY
  const weatherApiKey = "c31562d6228b1fc62e779b033e352bc0";
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

  // Grabbing current display elements
  const cityNameDisplay = $("#city-name");
  const currentDateDisplay = $("#current-date");
  currentDateDisplay.text(" (" + today.format("dddd, MMMM D") + ")");
  var currentEmojiDisplay = $("#weather-emoji-0");
  var tempDisplay = $("#temp-0");
  var windDisplay = $("#wind-0");
  var humidDisplay = $("#humid-0");

  //   Empty array to get populated from storage on page load
  var savedCitiesArray = [];

  if (localStorage.length > 0) {
    var currentParsedCities = JSON.parse(localStorage.getItem("savedCities"));
    savedCitiesArray.push(currentParsedCities);
    console.log("Here's your City Search history: \n", savedCitiesArray);
    displaySavedCities(savedCitiesArray);
  }

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
        var userCurrentCity = data.city;
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
        showErrorModal("We couldn't find your current location!");
      });
  }

  function displaySavedCities(savedCitiesArray) {
    //   Updating savedCitiesArray, which we'll iterate and display
    console.log(savedCitiesArray);
    currentParsedCities = JSON.parse(localStorage.getItem("savedCities"));
    savedCitiesArray = currentParsedCities;

    $("#saved-city-list").text("");

    for (i = 0; i < savedCitiesArray.length; i++) {
      var cityToDisplay = savedCitiesArray[i].cityName;
      var savedCityButton = $("<button>", {
        id: "saved-city-button",
        class: "btn btn-primary mb-1",
        text: cityToDisplay,
        style: "text-transform: capitalize;",
        click: function () {
          cityName = cityToDisplay;
          cityNameDisplay.text(cityName);
          cityNameDisplay.css("text-transform", "capitalize");
          fetchForecastByCity(cityName);
        },
      });
      $("#saved-city-list").append(savedCityButton);
    }
  }

  function fetchCurrentWeather(userCurrentCity) {
    // This url gets ONLY the current weather
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCurrentCity}&appid=${weatherApiKey}&units=imperial`;

    fetch(currentWeatherUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
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
        showErrorModal("We couldn't find the current weather for your area!");
      });
  }

  function displayCurrentWeather(
    currentIconCode,
    currentTemp,
    currentWind,
    currentHumidity
  ) {
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
    var forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherApiKey}&units=imperial`;

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
        showErrorModal(
          "We couldn't find a city by that name! Please make sure it is spelled correctly."
        );
      });
  }

  function displayForecastWeather(forecastArray) {
    for (i = 0; i < forecastArray.length; i++) {
      // console.log(forecastArray[i]);

      var forecastIconCode = forecastArray[i].weather[0].icon;
      var forecastTemp = Math.round(forecastArray[i].main.temp);
      var forecastWind = Math.round(forecastArray[i].wind.speed);
      var forecastHumid = Math.round(forecastArray[i].main.humidity);

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

  function storeCityNames(cityName) {
    var savedCitiesObject = { cityName };
    savedCitiesArray.push(savedCitiesObject);
    localStorage.setItem("savedCities", JSON.stringify(savedCitiesArray));
    displaySavedCities();
  }

  function displayRecommendedCities(event) {
    cityName = event.target.textContent;
    cityNameDisplay.text(cityName);
    cityNameDisplay.css("text-transform", "capitalize");
    fetchForecastByCity(cityName);
  }

  function showErrorModal(message) {
    $("#errorText").text(message);
    $("#errorModal").modal("show");
  }

  $("#close-button").on("click", function () {
    $("#errorModal").modal("hide");
  });

  $("#city-button-list").on("click", displayRecommendedCities);

  // Functionality to CLEAR button
  $("#clear-button").on("click", function () {
    localStorage.clear();
    savedCitiesArray = [];
    $("#saved-city-list").text("");
  });

  //   Functionality on Form submit
  citySearchForm.on("submit", function (event) {
    event.preventDefault();

    var cityName = locationInput.val();
    //   Clears inputField when submit
    locationInput.val("");

    //   Using a search pattern to weed out inputs I know won't work
    var verifyPattern = /[^a-zA-Z\s]/;
    if (verifyPattern.test(cityName)) {
      showErrorModal(
        "The searched city CANNOT contain numbers or special characters!"
      );
    } else {
      console.log("You searched for " + cityName + "!");
      fetchForecastByCity(cityName);
      cityNameDisplay.text(cityName);
      //   This guarantees the city name will look professional every time
      cityNameDisplay.css("text-transform", "capitalize");
      storeCityNames(cityName);
    }

    if (!cityName) {
      showErrorModal("You can't search for nowhere!");
    }
  });
});
