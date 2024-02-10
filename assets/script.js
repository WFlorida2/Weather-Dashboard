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

    // This is Weather API key
    var APIKey = "f848cebd8a210709c011b878be93124e";

    // Here building the URL I need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +"q=Cairo,Egypt&appid=" + APIKey;
    console.log(queryURL);
    // Here I run a Fetch call to the OpenWeatherMap API
    fetch(queryURL)
    .then(function (result) {
        return result.json();
    })
    .then(function (data) {
    console.log(data);
    });