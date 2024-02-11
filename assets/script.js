$(document).ready(function() {

    // Function to update the current date and time
    function updateDateTime() {
        // Get the current date and time using the dayjs library and format it
        var now = dayjs().format('dddd, D MMMM YYYY, HH:mm:ss');
        // Set the text of an element with ID "currentDay" to the formatted date and time
        $('#currentDay').text(now);
    }

    // Call the function initially to set the current date and time
    updateDateTime();
    // Update the date and time every second (1000 milliseconds)
    setInterval(updateDateTime, 1000);

    // declaring API key
    var APIKey = "f848cebd8a210709c011b878be93124e";
    var queryCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Ustka&appid=${APIKey}`;
    var queryForecast = `https://api.openweathermap.org/data/2.5/forecast?q=Ustka&appid=${APIKey}`;

    // Fetching data for current day
    fetch(queryCurrent)
    .then(function (result) {
        return result.json();
    })
    .then(function (data) {
        // Fetching data forecast for the coming 5 days
        fetch(queryForecast)
        .then(function (result) {
            return result.json();
        })
        .then(function (forecastData) {
            var forecastList = forecastData.list;
            // looping through the list
            var forecastHTML = '';
            
            var currentDate = dayjs().format("DD/MM/YYYY"); // Current date
            var addedDates = []; // Array to store dates already added to the forecast HTML

            forecastList.forEach(function(forecast){
                var date = dayjs.unix(forecast.dt).format("DD/MM/YYYY");
                // Exclude forecast for the current day and duplicates
                if (date !== currentDate && !addedDates.includes(date)) {
                    addedDates.push(date); // Add the date to the array
                    var weatherIcon = forecast.weather[0].icon;
                    var tempC = forecast.main.temp - 273.15;
                    forecastHTML += `
                        <div class="col">
                            <div id="forecast-card" class="card mb-2 mb-sm-2 mx-lg-3 text-center">
                                <div class="card-body">
                                    <h5 class="card-title">${date}</h5>
                                    <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
                                    <p class="card-text">Temperature : ${tempC.toFixed(2)} °C</p>
                                    <!-- Include other forecast data as needed -->
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
            $('#forecast').html(`<div class="row">${forecastHTML}</div>`);

            var cityName = data.name;
            var country = data.sys.country; // added a country identifier as some countries have same city names
            var currentDate = dayjs().format("("+"DD/MM/YYYY"+")");
            var weatherIcon = data.weather[0].icon;
            // ?: This is the ternary operator's conditional part. It's like saying "if data.rain exists and is truthy, then..." // Credit to google search on alternative 
            var rainData = data.rain ? data.rain['1h'] : 0; // if not rainy then shows zero chance of getting wet 🤣 👍
            var tempC = data.main.temp - 273.15;
            var wind = data.wind.speed;
            var humidity = data.main.humidity;
            var cardHTML = `
                <div id="currentDay-card" class="card">
                    <div class="card-body">
                    <h5 class="card-title">
                    <span style="font-weight: bold;">${cityName}</span> , 
                    <span style="font-weight: bold;">${country}</span>
                    <span style="font-weight: bold;">${currentDate}</span>
                    <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon"></h5>
                    <p class="card-text">Rain: ${rainData} mm</p>
                    <p class="card-text">Temperature : ${tempC.toFixed(2)} °C</p>
                    <p class="card-text">Wind Speed: ${wind} KPH</p>
                    <p class="card-text">Humidity: ${humidity} %</p>
                    </div>
                </div>
            `;
            // Appending the card to the container with ID 'today'
            $('#today').html(cardHTML);
        });
    });
});
