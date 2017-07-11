var app = angular.module("leaderboard");

app.service('HomeService', ['$rootScope', '$timeout', '$q', function ($rootScope, $timeout, $q) {

        this.getHotels = function (search) {
            return $q(function (resolve, reject) {
                setTimeout(function () {
                    var filteredHotels = [];
                    $.getJSON('data.json', function (data) {
                        angular.forEach(data, function (value) {
                            if (value.hotel_name.indexOf(search.name) > -1
                                    && value.category.indexOf(search.category) > -1
                                    && value.style.indexOf(search.style) > -1
                                    && value.city.indexOf(search.city) > -1
                                    && value.budget.indexOf(search.budget) > -1) {
                                filteredHotels.push(value);
                            }
                        });
                        console.log("filteredHotels ", filteredHotels)
                        resolve(filteredHotels);
                    });
                }, 1000);
            });


        }


    }]);