var map = angular.module('myApp', ['ngMap', 'tableSort', 'angular-table', 'ui.bootstrap']);
map.controller('myctrl', function($scope, $interval, $filter, NgMap, $http, $sce) {
    $scope.todayDate = new Date();
    $scope.changeOpen = "";
    var tdgd = $scope.todayDate.getDay();
    $scope.showdates = false;
    var vm = this;
    vm.activePage = 1;
    $scope.category = "All";
    $scope.alterDates = "Select Dates";
    NgMap.getMap().then(function(map) {
        vm.map = map;
        $scope.changeEverything(true, true, true, true, true);
    });
    $scope.currentZoom = 10;
    $scope.zoomChanged = function() {
   
    }
    $scope.dataPerPage = 10;
    $scope.makePagination = function() {
        var a = [];
        vm.dataLevelTwo = [];
        for (var i = 0; i < (vm.dataLevelOne.length / $scope.dataPerPage); i++) {
            var k = [];
            for (var j = i * $scope.dataPerPage; j < ((i * 10) + $scope.dataPerPage < vm.dataLevelOne.length ? (i * 10) + $scope.dataPerPage : vm.dataLevelOne.length); j++) {
                k.push(vm.dataLevelOne[j]);
            }
            a.push(k);
        }
        vm.dataLevelTwo = a;
        $scope.currentData = vm.dataLevelTwo[0];
        vm.dataLevelThree = [];
        console.log(vm.dataLevelTwo.length);
        for (var i = 0; i < 3; i++)
            vm.dataLevelTwo[i] ? vm.dataLevelThree.push({ data: vm.dataLevelTwo[i], value: i + 1 }) : false;
    }
    vm.searchText = "";
    $scope.currentPage = 1;
    $scope.customFilterFn = function(item) {
        var hotelMatch = item.title.toLowerCase().indexOf(vm.searchText.toLowerCase()) > -1;

        return hotelMatch;

    };
    $scope.zoomToIncludeMarkers = function(markers) {
        console.log(markers);
        var bounds = new google.maps.LatLngBounds();
        for (var key in markers) {
            bounds.extend(markers[key]);
        }
        if (vm.map) {
            vm.map.setCenter(bounds.getCenter());
            vm.map.fitBounds(bounds);
        }

    }
    vm.storeData = function(callback) {
        $scope.isFullView = false;
        var flag1 = true;
        var api = "https://apiimgoing.iti-marketing.com/api/posts/peachtree/facebook" + "?type=" + $scope.currentType;
        if ($scope.currentType == "location") {
            console.log($scope.category);
            api += "&category=" + encodeURIComponent($scope.category);
        }
        vm.currentData = [];
        console.log(api);
        $scope.icons = $scope.currentType == 'event' ? "img/flage-16.png" : "img/rsz_icon-restaurants20.png";
        $http.get(api).then(function(response) {
            vm.rowData = [];
            vm.rowData = response.data.posts;
            callback();
        }, function(response) {
            console.log(response);
        })
    }
    $scope.changebyCategory = function(c) {
        $scope.category = c;
        //$scope.PlacesDataCome();
    }
    $scope.PlacesDataCome = function(category) {
        $scope.currentType = "location";
        $scope.isPlaces = true;
        $scope.isEvents = false;
        $scope.n_placesmore = true;
        $scope.n_placesmore_options = false;

        $scope.changeEverything(true, true, true, true, true);
    }

    $scope.isPlaces = false;
    $scope.isEvents = true;
    $scope.currentType = "event";
    $scope.eventDataCome = function() {
        $scope.showdates = false;
        
        if($scope.isEvents) {
            $scope.isEvents = false;
            $scope.isPlaces = true;
        } else {
            $scope.isEvents = true;
            $scope.isPlaces = false;
        }
        
        $scope.n_showmore = false;
        $scope.n_placesmore_options = false;
        $scope.category = "All";
        $scope.currentType = "event";
        $scope.changeEverything(true, true, true, true, true)
    }


    function getDate(start_time) {
        var dd = start_time.slice(9, 11);
        dd[1] == ',' ? dd = dd[0] : dd = dd;
        var d = new Date(start_time.slice(12, 17), $scope.months.indexOf(start_time.slice(4, 7)), dd).getTime();

        return d;

    }

    vm.stated = true;
    $scope.titleclick = function(_id) {
        vm.stated = false;
        vm.selectedvalue = [];
        filtered = $filter('filter')(vm.rowData, { _id: _id });
        $scope.SIW(filtered[0]);
        vm.selectedvalue = filtered;

    }
    $scope.makeMarker = function() {
        vm.positions = $scope.currentData;
        console.log(vm.positions);
        if (vm.positions) {
            vm.clat = vm.positions[0].lat;
            vm.clng = vm.positions[0].lng;
        }
    }
    $scope.mapmarkerclicked = function() {
        console.log("value clicked");
        vm.positions = $filter('filter')(vm.dataLevelOne, { title: $scope.searchText });
    }
    $scope.hideFullView = function() {
        $scope.isFullView = false;
        vm.map.hideInfoWindow('foo-iw', vm.svalue._id);
        vm.svalue = null;

    }
    $scope.showdetails = function(e, values) {

            $scope.fullView(values);
            vm.svalue = values;
            $scope.fullView(values);
            vm.selectedvalue = [values];
            vm.map.showInfoWindow('foo-iw', values._id);
        }
    
    $scope.MshowInfoWindow = function(e, values) {
        vm.svalue = values;
        vm.map.showInfoWindow('foo-iw', values._id);
    }
    $scope.SIW = function(values) {
        vm.svalue = values;
        vm.map.showInfoWindow('foo-iw', values._id);
    }
    $scope.isFullView = false;
    $scope.fullView = function(values) {
            if (values.facebook_id) {
                console.log(values.facebook_id);
                getFeed(values.facebook_id, function(response) {
                    $scope.specificvalue.facebook_posts = response;
                    console.log($scope.specificvalue.facebook_posts);
                });
            }

            console.log("now make full view ");
            $scope.isFullView = true;
            $scope.specificvalue = values;
            vm.svalue = values;
            vm.map.showInfoWindow('foo-iw', values._id);
            if ($scope.currentType == 'location') {
                var dmx = new Date();
                var dmx = dmx.getDay();
                if (dmx == 0) {
                    $scope.specificvalue.openhours = $scope.specificvalue.hours.mon_1_open;
                    $scope.specificvalue.closehours = $scope.specificvalue.hours.mon_1_close;
                } else if (dmx == 1) {
                    $scope.specificvalue.openhours = $scope.specificvalue.hours.tue_1_open;
                    $scope.specificvalue.closehours = $scope.specificvalue.hours.tue_1_close;
                } else if (dmx == 2) {
                    $scope.specificvalue.openhours = $scope.specificvalue.hours.wed_1_open;
                    $scope.specificvalue.closehours = $scope.specificvalue.hours.wed_1_close;
                } else if (dmx == 3) {
                    $scope.specificvalue.openhours = $scope.specificvalue.hours.thu_1_open;
                    $scope.specificvalue.closehours = $scope.specificvalue.hours.thu_1_close;
                } else if (dmx == 4) {
                    $scope.specificvalue.openhours = $scope.specificvalue.hours.fri_1_open;
                    $scope.specificvalue.closehours = $scope.specificvalue.hours.fri_1_close;
                } else if (dmx == 5) {
                    $scope.specificvalue.openhours = $scope.specificvalue.hours.sat_1_open;
                    $scope.specificvalue.closehours = $scope.specificvalue.hours.sat_1_close;
                } else if (dmx == 6) {
                    $scope.specificvalue.openhours = $scope.specificvalue.hours.sun_1_open;
                    $scope.specificvalue.closehours = $scope.specificvalue.hours.sun_1_close;
                } else {
                    $scope.specificvalue.openhours = false;
                    $scope.specificvalue.closehours = " open";

                }
            }
        }
        $scope.actived = function(k) {
        if (k == $scope.currentPage) {
            return '`';
        } else {
            return "";
        }
    }
    $scope.changeDataPerPage = function(newPage, cE) {
        var ice = false;
        if (newPage == 'pre') {
            if ($scope.preclass != 'disabled') {
                if ($scope.currentPage > 1) {
                    $scope.currentPage -= 1;
                    console.log("scope is ", $scope.crow, "currentPage is", $scope.currentPage);
                    if ($scope.crow <= $scope.currentPage) {
                        $scope.crow -= 1;
                        $scope.FitData();
                        ice = true;
                    } else {
                        ice = true;
                    }
                }
            }
        } else if (newPage == 'next') {
            if ($scope.nclass != "disabled") {
                console.log($scope.currentPage, $scope.crow, vm.dataLevelTwo.length);
                if ($scope.currentPage < vm.dataLevelTwo.length) {
                    $scope.currentPage = $scope.currentPage + 1;
                    console.log("scope is ", $scope.crow + 3, "currentPage is", $scope.currentPage, 'data lvele two data', vm.dataLevelTwo.length);
                    if ($scope.currentPage > $scope.crow + 3) {
                        $scope.crow += 1;
                        $scope.FitData();
                    }
                    ice = true;
                }
            }
        } else {
            $scope.currentPage = newPage;
            $scope.crow = $scope.currentPage - 2;
            console.log('specifig value is coming i do now why ', $scope.crow);
            $scope.FitData();

            ice = true;
        }
        if ($scope.currentPage == vm.dataLevelTwo.length) {
            $scope.nclass = "disabled";
        } else {
            $scope.nclass = "";
        }
        if ($scope.currentPage == 1) {
            $scope.preclass = "disabled";
        } else {
            $scope.preclass = "";
        }

        $scope.isFullView = false;
        vm.selectedvalue = [];
        if (ice) {
            $scope.currentData = vm.dataLevelTwo[$scope.currentPage - 1];
            console.log($scope.currentData);
            if (cE) $scope.changeEverything(false, true, false, false, true);
        }
    }
    $scope.changeEverything = function(sd, cm, mp, cd, zm, options, md) {
        console.log(sd, cm, mp, cd, zm, options);
        if (sd)
            vm.storeData(function() {
                   for (var i = 0; i < vm.rowData.length;) {
                    if (vm.rowData[i].type == 'cluster') {
                            vm.rowData.splice(i, 1);
    
                    } else {
                        if (vm.rowData[i].start_time) {
                            vm.rowData[i].cdate = getDate(vm.rowData[i].start_time);
                        }
                        i++
                    }
                }
    
                vm.dataLevelOne = vm.rowData;
                vm.selectedvalue = [];

                if (mp) $scope.makePagination();
                if (cd) $scope.changeDataPerPage(1);
                if (cm) $scope.makeMarker();
                        if (zm) $scope.zoomToIncludeMarkers($scope.currentData);
            })
        else {
            if (mp) $scope.makePagination();
            if (options) {
                if (options.perpageValue && options.cE == false) {
                    console.log(options.perpageValue);
                    $scope.changeDataPerPage(options.perpageValue, false);
                } else if (!options.perpageValue && options.cE) {
                    $scope.changeDataPerPage(1, true);
                } else if (options.perpageValue && options.cE) {
                    $scope.changeDataPerPage(options.perpageValue, true);
                } else {
                    $scope.changeDataPerPage(1, false);
                }
            }
            if (cm) $scope.makeMarker();
            if (zm) $scope.zoomToIncludeMarkers($scope.currentData);
        }

    }
    $scope.currentType = 'event';

    $scope.changeByDate = function(value) {
        $scope.specificdate = false;
        if (value == 'today') {

        } else {
            var makedate = $scope.makeDate(1, 0, 0);
            $scope.findDataFromDate(makedate);
            $scope.changeEverything(false, true, true, true);
        }
    }
    $scope.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    $scope.makeDate = function(dx, mx, yx) {
        var today = new Date();
        var dd = today.getDate() + dx;
        var mm = today.getMonth() + mx; //January is 0!
        var yyyy = today.getFullYear() + yx;
        
        if (dd < 10) {
            dd = '0' + dd
        }


        var d = new Date();
        today = $scope.days[(d.getDay() + dx) % 7] + " " + $scope.months[mm] + ', ' + dd + ', ' + yyyy;
        console.log(today);
        return today;
    }
    $scope.findDataFromDate = function(d) {
        var k = [];
        console.log(d);
        for (var i = 0; i < vm.rowData.length; i++) {
            console.log(vm.rowData[i].start_time.slice(0, 17));
            if (vm.rowData[i].start_time.slice(0, 17) == d) {
                k.push(vm.rowData[i]);
            }
        }
        vm.dataLevelOne = k;
    }
    $scope.getFromSpecificDate = function() {
        console.log($scope.startdate);
        var d = new Date($scope.startdate);
        var ed = new Date($scope.enddate);
        var cd = d.getTime();
        var cod = ed.getTime();
        
        console.log(cd, cod);
        var k = [];
        for (var i = 0; i < vm.rowData.length; i++) {
            if (cd <= vm.rowData[i].cdate && vm.rowData[i].cdate <= cod) {
                k.push(vm.rowData[i]);
            }
        }
        vm.dataLevelOne = k;
        $scope.changeEverything(false, true, true, true, true);
    }
    vm.last = vm.searchText;

    function updateTime() {
        if (vm.last != vm.searchText) {
            vm.last = vm.searchText;
            vm.specificvalue = [];
            vm.dataLevelOne = $filter('filter')(vm.rowData, { title: vm.searchText });
            $scope.changeEverything(false, true, true, true, true);
        }
    }

    $interval(updateTime, 200);
    $scope.changeSizePage = function() {
                $scope.changeEverything(false, true, true, true, true);
    }
    $scope.sortByMostAttandent = function() {
        $scope.showdates = false;
        $scope.alterDates = "Select Dates";
        console.log('coming');
        vm.dataLevelOne = $filter('orderBy')(vm.rowData, '+attending_count', 'desc');
        $scope.changeEverything(false, false, true, true, true);
    }
    $scope.sdateClick = function() {
        if ($scope.alterDates == "Select Dates") {
            $scope.showdates = false;
            $scope.eventDataCome();
        }
        if ($scope.alterDates == "spedate") {
            $scope.showdates ? $scope.showdates = false : $scope.showdates = true;
        } else if ($scope.alterDates == "today") {
            $scope.showdates = false;
            var makedate = $scope.makeDate(0, 0, 0);
            $scope.findDataFromDate(makedate);
            $scope.changeEverything(false, true, true, true);
        } else if ($scope.alterDates == "tommorow") {
            $scope.showdates = false;
            var makedate = $scope.makeDate(1, 0, 0);
            $scope.findDataFromDate(makedate);
            $scope.changeEverything(false, true, true, true, true);
            console.log($scope.alterDates);
        } else if ($scope.alterDates == "thisweekend") {
            $scope.showdates = false;
            var d = new Date();
            var day = d.getDay();

            var cd = day != 0 ? 6 - day : day;
            var cod = cd + 1;
            cd = $scope.makeDate(cd, 0, 0);
            cod = $scope.makeDate(cod, 0, 0);
            cd = new Date(cd).getTime();
            cod = new Date(cod).getTime();
            
            console.log(cd, cod);
            var k = [];
            for (var i = 0; i < vm.rowData.length; i++) {
                if (cd <= vm.rowData[i].cdate && vm.rowData[i].cdate <= cod) {
                    k.push(vm.rowData[i]);
                }
            }
            vm.dataLevelOne = k;
            $scope.changeEverything(false, true, true, true, true);
    
        } else if ($scope.alterDates == "thisweek") {
            $scope.showdates = false;
            console.log('thisweek');
            var d = new Date();
            var day = d.getDay();

            var cd = 0 - day;
            var cod = cd + 7;
            console.log(cd, cod);
            cd = $scope.makeDate(cd, 0, 0);
            cod = $scope.makeDate(cod, 0, 0);
            cd = new Date(cd).getTime();
            cod = new Date(cod).getTime();
            // console.log(document.getElementById('dtp1').value);
            var k = [];
            for (var i = 0; i < vm.rowData.length; i++) {
                if (cd <= vm.rowData[i].cdate && vm.rowData[i].cdate <= cod) {
                    k.push(vm.rowData[i]);
                }
            }
            vm.dataLevelOne = k;
            $scope.changeEverything(false, true, true, true);
        }
    }
    $scope.getIframeSrc = function(videoId) {
        if (videoId) {
            return $sce.trustAsResourceUrl('https://www.facebook.com/plugins/share_button.php?href=https://facebook.com/' + videoId + "&layout=button_count&size=large&mobile_iframe=true&width=106&height=28&appId");
        }
    };
    $scope.whichType = function(type, which) {
        console.log('atleast coming');
        return type === which;
    }
    $scope.getTweetUrl = function(_id, title) {
        return $sce.trustAsResourceUrl("https://twitter.com/intent/tweet?url=" + encodeURIComponent("https://imgoing.iti-marketing.com/#/peachtree/event/" + _id + "?_k=0v0t59") + "&text=" + encodeURIComponent(title) + "&original_referer=");
    }
    $scope.crow = 0;
    
    $scope.FitData = function() {
            if (vm.dataLevelTwo[$scope.crow]) {
                vm.dataLevelThree = [];
                console.log($scope.crow);
                for (var i = $scope.crow; i < $scope.crow + 3; i++) {
                    vm.dataLevelTwo[i] ? vm.dataLevelThree.push({ data: vm.dataLevelTwo[i], value: i + 1 }) : i += 4;
                }
            }
        }
        
    $scope.eventIGo = function(i) {
        loginStatus(function(response) {
            // facebookAPI('/' + response + '/events')
            console.log(response);
        })
    }
    $scope.n_showdates = false;
    $scope.n_showdatesf = function() {
        console.log($scope.n_showdates);
        $scope.n_showdates = $scope.n_showdates ? false : true;
    }
    $scope.todayfa = "fa-circle-o";
    $scope.todayfaiconchange = function() {
        $scope.todayfa = "fa-dot-circle-o";
        $scope.tomorrowfa = "fa-circle-o";
        $scope.weekendfa = "fa-circle-o";
        $scope.weekfa = "fa-circle-o";
        $scope.specificfa = "fa-circle-o";
        $scope.alterDates = 'today';
        $scope.sdateClick();
    }
    $scope.todayfa = "fa-circle-o";
    $scope.tomorrowfaiconchange = function() {
        $scope.todayfa = "fa-circle-o";
        $scope.tomorrowfa = "fa-dot-circle-o";
        $scope.weekendfa = "fa-circle-o";
        $scope.weekfa = "fa-circle-o";
        $scope.specificfa = "fa-circle-o";
        $scope.alterDates = 'tommorow';
        $scope.sdateClick();
    }
    $scope.todayfa = "fa-circle-o";
    $scope.weekendfaiconchange = function() {
        $scope.todayfa = "fa-circle-o";
        $scope.tomorrowfa = "fa-circle-o";
        $scope.weekendfa = "fa-dot-circle-o";
        $scope.weekfa = "fa-circle-o";
        $scope.specificfa = "fa-circle-o";
        $scope.alterDates = 'thisweekend';
        $scope.sdateClick();
    }
    $scope.todayfa = "fa-circle-o";
    $scope.weekfaiconchange = function() {
        $scope.todayfa = "fa-circle-o";
        $scope.tomorrowfa = "fa-circle-o";
        $scope.weekendfa = "fa-circle-o";
        $scope.weekfa = "fa-dot-circle-o";
        $scope.specificfa = "fa-circle-o";
        $scope.alterDates = 'thisweek';
        $scope.sdateClick();
    }
    $scope.todayfa = "fa-circle-o";
    $scope.specificfaiconchange = function() {
        $scope.todayfa = "fa-circle-o";
        $scope.tomorrowfa = "fa-circle-o";
        $scope.weekendfa = "fa-circle-o";
        $scope.weekfa = "fa-circle-o";
        $scope.specificfa = "fa-dot-circle-o";
        $scope.alterDates = 'Select Dates';
        $scope.sdateClick();

    }
    $scope.n_showmore = false;
    $scope.n_showmoref = function() {
        console.log($scope.n_showmore);
        $scope.n_showmore = $scope.n_showmore ? false : true;
    }
    $scope.n_placesmore = false;
    $scope.n_placesmore_options = false;
    $scope.n_placesmore_optionsf = function() {
        console.log($scope.n_placesmore_options);
        $scope.n_placesmore_options = $scope.n_placesmore_options ? false : true;
    }
});
var fb_token = "EAACEdEose0cBADyXZC9nXQkXDEgC40aDquid9qGxfmCc7ZCKI40DOzH8fxyLOPloZCfKus1QfZC8chGOxphmr4eCrYDDpFXtZBuXovMnZCV9zT8Nf7hMJCRaWhN7A9p8EKkP3mfBmW7rR9Mybpo6OOR8xbIApjAZAGWSTJLIxCXdLQI6PvLZBkhZA5gWa8HvC3PIZD";

function eventsigo() {

}

function facebookAPI(api, callback) {
    FB.api(api, {
        access_token: fb_token
    }, function(response) {
        if (response && !response.error) {
            callback(response);
        }
    })
}

function loginStatus(callback) {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            if (response.status === 'connected') {
                callback(response);
            }
        }
    })
}

function getFeed(feedid, callback) {
    console.log(feedid);
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            var uid = response.authResponse.userID;
            var asc = response.authResponse.accessToken;
            console.log(fb_token);
            FB.api(
                "/" + feedid + "/feed", {
                    access_token: fb_token
                },
                function(response) {
                    if (response && !response.error) {
                        /* handle the result */
                        // console.log(response);
                        console.log(response.data[0].from.id);
                        getFacebookImage(response.data, function(response) {
                            console.log(response)
                            callback(response);

                        })

                    }
                    console.log(response);
                });
        } else if (response.status === 'not_authorized') {
            console.log(response);
            // the user is logged in to Facebook,
            // but has not authenticated your app
        } else {
            // the user isn't logged in to Facebook.
        }
    });
}

function getFacebookImage(data, callback) {
    var k = 0;
    console.log(data.length);
    for (var i = 0; i < data.length; i++) {
        var m = i;
        FB.api(
            '/' + data[i].from.id + '/picture', {
                access_token: fb_token
            },
            function(response) {
                console.log(data[m]);
                data[m].from.purl = response.data.url;
                k++;
                if (k >= data.length) {
                    callback(data);
                }
            })
    }
}

