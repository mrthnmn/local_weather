 $(document).ready(function() {
   var location = document.getElementById("location");
   var units = "metric";
   var dayNight = "";

   // Check to see if browser handles geolocation.
   function getLocation() {
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition();
     } else {
       location.innerHTML = "Geolocation is not supported by this browser.";
     }
   }

   // Get the weather conditions based on geo-coords.
   navigator.geolocation.getCurrentPosition(showWeather);

   function showWeather(position) {
     var latitude = position.coords.latitude;
     var longitude = position.coords.longitude;

     var apiRequest = new XMLHttpRequest();
     var url = "http://api.openweathermap.org/data/2.5/forecast/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=b72ef5f4374fa626a6240c87c96effb2";

     apiRequest.onreadystatechange = function() {
       if (apiRequest.readyState == 4 && apiRequest.status == 200) {
         var responseObj = JSON.parse(apiRequest.responseText);

         // Collect the weather details:
         function toTitleCase(str) {
           return str.replace(/\w\S*/g, function(txt) {
             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
           });
         }
         var description = toTitleCase(responseObj.list[0].weather[0].description);

         var temp = Math.round(responseObj.list[0].main.temp - 273.15);
         var speed = Math.round(responseObj.list[0].wind.speed * 3.6);
         var direction = responseObj.list[0].wind.deg;

         // Convert degrees to ordinal points.
         if (direction > 338.5 || direction < 22.5) {
           direction = "N";
         } else
         if (direction < 67.5) {
           direction = "NE";
         } else
         if (direction < 112.5) {
           direction = "E";
         } else
         if (direction < 157.5) {
           direction = "SE";
         } else
         if (direction < 202.5) {
           direction = "S";
         } else
         if (direction < 247.5) {
           direction = "SE";
         } else
         if (direction < 293.5) {
           direction = "W";
         } else
         if (direction < 338.5) {
           direction = "NW";
         }
         
         // set background image depending on weather description.
         var sky = responseObj.list[0].weather[0].description;
         var cloudy = /cloud/i;
         var rainy = /rain/i;
         var snowy = /snow/i;
         if (cloudy.test(sky)) {
           $(".container").css("background-image", 'url("https://bjh.name/images/cloudy_day_sky.jpg")')
         } else if (rainy.test(sky)) {
           $(".container").css("background-image", 'url("https://bjh.name/images/rainy_day_sky.jpg")')
         } else if (snowy.test(sky)) {
           $(".container").css("background-image", 'url("https://bjh.name/images/snowy_day_sky.jpg")')
         } else {
           $(".container").css("background-image", 'url("https://bjh.name/images/blue_sky.jpg")')
         }
         // This gets the city from the IP address
         // and puts it on the page:

         $.getJSON("http://ip-api.com/json", function(data) {
           location.innerHTML = data.city + ", " + data.regionName;
         });

         // Put all the weather readings on the page.
         weather.innerHTML = "Current Conditions:<br>" + description;
         temperature.innerHTML = "Temperature: " +
           temp + "&deg;C";
         windSpeed.innerHTML = "Wind Speed: " + speed + " kph";
         windDirection.innerHTML = "Direction: " + direction;

         $("button").click(function() {
           if (units == "metric") {
             temperature.innerHTML = "Temperature: " +
               Math.round((temp * 1.8) + 32) + "&deg;F";
             windSpeed.innerHTML = "Wind Speed: " + Math.round(speed * 0.62) + " mph";
             corf.innerHTML = "Imperial";
             units = "imperial";
           } else {
             temperature.innerHTML = "Temperature: " +
               temp + "&deg;C";
             windSpeed.innerHTML = "Wind Speed: " + speed + " kph";
             corf.innerHTML = "Metric";
             units = "metric";
           }
         });

       }
     };
     apiRequest.open("GET", url, true);
     apiRequest.send();
   }
 });
