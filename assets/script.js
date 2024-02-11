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
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=Ustka&appid=${APIKey}`;
        fetch(queryURL)
        .then(function (result) {
        return result.json();
        })
        .then(function (data) {
        
        var cityName = data.name;
        var country = data.sys.country; // added a country identifier as some countries have same city names
        var currentDate = dayjs().format("("+"DD/MM/YYYY"+")");
        var weatherIcon = data.weather[0].icon;
        //console.log(weatherIcon);
        // ?: This is the ternary operator's conditional part. It's like saying "if data.rain exists and is truthy, then..." // Credit to google search on alternative 
        var rainData = data.rain ? data.rain['1h'] : 0; // if not rainy then shows zero chance of getting wet 🤣 👍
        var tempC = data.main.temp - 273.15;
        var cardHTML = `
            <div class="card">
                <div class="card-body">
                <h5 class="card-title">${cityName +" , "+country} ${currentDate} 
                <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon"></h5>
                <p class="card-text">Rain: ${rainData} mm</p>
                <p class="card-text">Temperature : ${tempC.toFixed(2)} °C</p>
                </div>

            </div>
        `;
        // Appending the card to the container with ID 'today'
        $('#today').html(cardHTML);
    });
});

