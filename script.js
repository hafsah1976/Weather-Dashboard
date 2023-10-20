//assign apikey to a variable
var apiKey = 'cc31170c87a14f51e3e882fc3599e433'; 

// Initialize an empty array to store saved searches
var savedSearches = [];

// Function to display search history
var searchHistory = function(cityInput) {
    // Logging the city input
    console.log("Your input: " + cityInput);

    // Remove any previous search history entry with the same city name
    $('.collection-item:contains("' + cityInput + '")').remove(); // Match the CSS class with your HTML

    // Create a new search history entry with the city name
    var addSearchHistory = $("<li>");
    addSearchHistory.addClass("collection-item"); // Match the CSS class with your HTML
    addSearchHistory.text(cityInput);

    // Create a container for the search history entry
    var searchHistoryContainer = $("#cityList"); // Match the ID with your HTML

    // Append the entry to the container
    searchHistoryContainer.append(addSearchHistory);

    // Check if there are previously saved searches
    if (savedSearches.length > 0) {
        // Retrieve and update the saved searches array from local storage
        var previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

    // Add the city name to the array of saved searches
    savedSearches.push(cityInput);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    // Reset the search input
    $("#city-input").val("");
};

// Function to load saved search history entries into the search history container
var viewSearchHistory = function() {
    // Get the saved search history from local storage
    var savedCities = localStorage.getItem("savedSearches");

    // Return if there are no previous saved searches
    if (!savedCities) {
        return;
    }

    // Parse the saved search history string into an array
    savedCities = JSON.parse(savedCities);

    // Loop through the saved search history array and create an entry for each item
    for (var i = 0; i < savedCities.length; i++) {
        // Call the searchHistory function to display each saved city in the search history container
        searchHistory(savedCities[i]);
    }
};


// Function to display current weather data for a city
var viewCurrentWeather = function(cityInput) {
    // Use the OpenWeatherMap API to fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // Extract the city's longitude and latitude
            var lon_Coord = response.coord.lon;
            var lat_Coord = response.coord.lat;

            // Use the OpenWeatherMap One Call API to fetch additional data
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat_Coord}&lon=${lon_Coord}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    // Populate the current weather section with data
                    searchHistory(cityInput);

                    // Add a container for current weather with a border
                    var WeatherNowContainer = $("#current-weather-container");
                    WeatherNowContainer.addClass("current-weather-container");

                    // Display city name, date, and weather icon
                    var title_Now = $("#current-title");
                    var Day_Now = moment().format("MM/DD/YYYY");
                    title_Now.text(`${cityInput} (${Day_Now})`);

                    var iconNow = $("#current-weather-icon");
                    iconNow.addClass("current-weather-icon");
                    var code_IconNow = response.current.weather[0].icon;
                    iconNow.attr("src", `https://openweathermap.org/img/wn/${code_IconNow}@2x.png`);

                    // Display current temperature
                    var temperature_Now = $("#current-temperature");
                    temperature_Now.text("Temperature: " + response.current.temp + " \u00B0F");

                    // Display current humidity
                    var Humidity_Now = $("#current-humidity");
                    Humidity_Now.text("Humidity: " + response.current.humidity + "%");

                    // Display current wind speed
                    var WindSpeed_Now = $("#current-wind-speed");
                    WindSpeed_Now.text("Wind Speed: " + response.current.wind_speed + " MPH");


                    // fetchAirQuality(cityInput);

                    // fetchRoadRisk(cityInput);
                })
        })
        .catch(function(error) {
            // Reset the search input
            $("#city-input").val("");

            // Alert the user about the error
            alert("Please type a valid city.");
        });
};

// Function to fetch and display air quality data
var fetchAirQuality = function(lat_Coord, lon_Coord, apiKey) {
    // Use the appropriate API to fetch air quality data
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat_Coord}&lon=${lon_Coord}&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // Extract air quality data
            var airQuality = response.list[0].main.aqi;

            // Map air quality index to a human-readable value
            var airQualityStatus;
            switch (airQuality) {
                case 1:
                    airQualityStatus = "Good";
                    break;
                case 2:
                    airQualityStatus = "Fair";
                    break;
                case 3:
                    airQualityStatus = "Moderate";
                    break;
                case 4:
                    airQualityStatus = "Poor";
                    break;
                case 5:
                    airQualityStatus = "Very Poor";
                    break;
                default:
                    airQualityStatus = "Unknown";
            }

            // Display the air quality data in the appropriate HTML element
            var airQualityElement = $("#air-quality");
            airQualityElement.text("Air Quality: " + airQualityStatus);
        })
        .catch(function (error) {
            console.error("Error fetching air quality data: ", error);
        });
};

// Function to display the 5-day forecast
var displayFiveDayForecast = function(data) {
    // Add a title for the 5-day forecast
    var fiveDayForecast = $("#five-days-forecast");
    fiveDayForecast.text("5-Day Forecast:");

    // Loop to create 5 forecast cards
    for (var i = 1; i <= 5; i++) {
        var card_Future = $(".five-days").eq(i - 1); // Get the current card by index
        card_Future.addClass("forecast-details");

        // Display the date for each forecast card
        var date_Future = $("#future-date-" + i);
        date = moment().add(i, "d").format("MM/DD/YYYY");
        date_Future.text(date);

        // Display the weather icon for each forecast card
        var Icons = $("#future-icon-" + i);
        Icons.addClass("future-icon");
        var IconCode_Future = data.daily[i].weather[0].icon;
        Icons.attr("src", `https://openweathermap.org/img/wn/${IconCode_Future}@2x.png`);

        // Display the temperature for each forecast card
        var Temperature_ = $("#temp-future" + i);
        Temperature_.text("Temperature: " + data.daily[i].temp.day + " \u00B0F");

        // Display the humidity for each forecast card
        var future_Humidity = $("#humidity-future" + i);
        future_Humidity.text("Humidity: " + data.daily[i].humidity + "%");
    }
};
