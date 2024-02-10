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

