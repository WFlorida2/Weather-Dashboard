$(document).ready(function () {
    // Show the modal on page load / refresh
    $("#infoModal").modal("show");

    // Function to update the current date and time
    function updateDateTime() {
        // Get the current date and time using the dayjs library and format it
        var now = dayjs().format("dddd, D MMMM YYYY, HH:mm:ss");
        // Set the text of an element with ID "currentDay" to the formatted date and time
        $("#currentDay").text(now);
    }

    // Call the function initially to set the current date and time
    updateDateTime();
    // Update the date and time every second (1000 milliseconds)
    setInterval(updateDateTime, 1000);

    // Declaring API key
    var APIKey = "f848cebd8a210709c011b878be93124e";

    // Function to generate / display the recent searches as buttons
    function renderRecentSearches() {
        // Retrieve recent searches from local storage, parse from JSON, and assign to storedSearches, or default to empty array
        var storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        // Here, mapping each city in storedSearches array to a button HTML string and joins them together into a single string
        var buttonsHTML = storedSearches.map(function(city) {
            return '<button type="button" class="btn btn-primary recent-search">' + city + '</button>';
        }).join("");
        $("#history").html(buttonsHTML);
    }

    // Render recent searches on page load
    renderRecentSearches();

    // Event listener for recent search buttons
    $(document).on("click", ".recent-search", function () {
        var selectedCity = $(this).text();
        $("#input-field").val(selectedCity);
        $("#search-button").click();
    });

    // Event listener for the search button
    $("#search-button").click(function () {
        // Get the value entered by the user in the input field
        var cityName = $("#input-field").val().trim();

        // Check if the input field is not empty
        if (cityName !== "") {
            // Construct the API query URL for current weather data
            var queryCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

            // Fetching data for current day
            fetch(queryCurrent)
                .then(function (result) {
                    return result.json();
                })
                .then(function (data) {
                    var cityName = data.name;
                    var country = data.sys.country; // added a country identifier as some countries have same city names
                    var currentDate = dayjs().format("(" + "DD/MM/YYYY" + ")");
                    var currentWeatherIcon = data.weather[0].icon;
                    // ?: This is the ternary operator's conditional part. It's like saying "if data.rain exists and is truthy, then..." 
                    // if not rainy then shows zero chance of getting wet 🤣 👍
                    // Credit to google search on alternative
                    var rainData = data.rain ? data.rain["1h"] : 0; 
                    var tempC = data.main.temp - 273.15;
                    var wind = data.wind.speed;
                    var humidity = data.main.humidity;
                    // '\` is a way to format long strings for better readability in the code
                    var cardHTML = '\
                    <div id="currentDay-card" class="card">\
                        <div class="card-body">\
                        <h5 class="card-title">\
                        <span style="font-weight: bold;">' + cityName + '</span> , \
                        <span style="font-weight: bold;">' + country + '</span>\
                        <span style="font-weight: bold;">' + currentDate + '</span>\
                        <img src="http://openweathermap.org/img/w/' + currentWeatherIcon + '.png" alt="Weather Icon"></h5>\
                        <p class="card-text">Rain: ' + rainData + ' mm</p>\
                        <p class="card-text">Temp: ' + tempC.toFixed(2) + ' °c</p>\
                        <p class="card-text">Wind: ' + wind + ' km/h</p>\
                        <p class="card-text">Humidity: ' + humidity + ' %</p>\
                        </div>\
                    </div>\
                ';
                    // Appending the card to the container with ID 'today'
                    $("#today").html(cardHTML);

                    // Store the city name in local storage
                    var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
                    // Remove city name if it's already in the recent searches
                    recentSearches = recentSearches.filter(function(search) {
                        return search !== cityName;
                    });
                    // Add the city name to recent searches
                    recentSearches.unshift(cityName);
                    // Keep only the last five searches
                    recentSearches = recentSearches.slice(0, 5);
                    // Save recent searches to local storage
                    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
                    // Render recent searches
                    renderRecentSearches();
                });

            // Construct the API query URL for forecast data
            var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

            // Fetching data forecast for the coming 5 days
            fetch(queryForecast)
                .then(function (result) {
                    return result.json();
                })
                .then(function (forecastData) {
                    var forecastList = forecastData.list;
                    // Looping through the list
                    var forecastHTML = "";

                    var currentDate = dayjs().format("DD/MM/YYYY"); // Current date
                    var addedDates = []; // Array to store dates already added to the forecast HTML
                    var wind, humidity; // Declaring wind and humidity variables

                    // Using for loop 
                    for (var i = 0; i < forecastList.length; i++) {
                        var forecast = forecastList[i];
                        var date = dayjs.unix(forecast.dt).format("DD/MM/YYYY");
                        // Exclude forecast for the current day and remove duplicates
                        if (date !== currentDate && !addedDates.includes(date)) {
                            addedDates.push(date); // Add the date to the array
                            var forecastWeatherIcon = forecast.weather[0].icon;
                            var tempC = forecast.main.temp - 273.15;
                            wind = forecast.wind.speed; // Assigning wind speed
                            humidity = forecast.main.humidity; // Assigning humidity
                            forecastHTML += '\
                            <div class="col">\
                                <div id="forecast-card" class="card mb-2 mb-sm-2 mx-lg-3 text-center">\
                                    <div class="card-body">\
                                        <h5 class="card-title">' + date + '</h5>\
                                        <img src="http://openweathermap.org/img/w/' + forecastWeatherIcon + '.png" alt="Weather Icon">\
                                        <p class="card-text">Temp: ' + tempC.toFixed(2) + ' °c</p>\
                                        <p class="card-text">Wind: ' + wind + ' km/h</p>\
                                        <p class="card-text">Humidity: ' + humidity + ' %</p>\
                                    </div>\
                                </div>\
                            </div>\
                        ';
                        }
                    }

                    $("#forecast").html('<div class="row">' + forecastHTML + '</div>');
                });
        } else {
            // If city name is empty, display the modal
            $("#infoModal").modal("show");
        }

        // Empty the search field
        $("#input-field").val("");
    });
});
