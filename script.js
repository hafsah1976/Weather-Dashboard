//assign apikey to a variable
var apiKey = ''; 

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
