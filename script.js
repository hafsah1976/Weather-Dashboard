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
    var viewSearchHistory = $("<li>");
    viewSearchHistory.addClass("collection-item"); // Match the CSS class with your HTML
    viewSearchHistory.text(cityInput);

    // Create a container for the search history entry
    var searchHistoryContainer = $("#cityList"); // Match the ID with your HTML

    // Append the entry to the container
    searchHistoryContainer.append(viewSearchHistory);

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
