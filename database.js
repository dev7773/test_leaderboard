angular.module('database',[])
.controller('databasectrl',function($http,$scope) {
	// var database = {};
	// database.datamoredata = function() {
		// $http.defaults.useXDomain = true;
		// delete $http.defaults.headers.common['X-Requested-With'];
		// console.log('here coming');
		// $http.get('http://localhost:3877/api/posts/tidwebs/facebook').then(function (response) {
		// 	// console.log("e=");
		// 	// console.log(e);
		// 	// console.log(;value)
		// 	console.log('response');
		// 	console.log(response.data);
		// },function(response) {
		// 	console.log(response);
		// })
	// }
	var js
	// js.src = "//connect.facebook.net/en_US/sdk.js";

 
$scope.getMyLastName = function() {
   facebookService.getMyLastName() 
     .then(function(response) {
       $scope.last_name = response.last_name;
       console.log($scope.last_name)
     }
   );
};
$scope.getMyLastName();
})
.factory('facebookService', function($q) {
    return {
        getMyLastName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name'
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
})
.run(['$rootScope', '$window', 'srvAuth',
  function($rootScope, $window, sAuth) {

  $rootScope.user = {};

  $window.fbAsyncInit = function() {
    // Executed when the SDK is loaded

    FB.init({

      /*
       The app id of the web app;
       To register a new app visit Facebook App Dashboard
       ( https://developers.facebook.com/apps/ )
      */

      appId: '113566229195740',

      /*
       Adding a Channel File improves the performance
       of the javascript SDK, by addressing issues
       with cross-domain communication in certain browsers.
      */

      channelUrl: 'app/channel.html',

      /*
       Set if you want to check the authentication status
       at the start up of the app
      */

      status: true,

      /*
       Enable cookies to allow the server to access
       the session
      */

      cookie: true,

      /* Parse XFBML */

      xfbml: true
    });

    sAuth.watchAuthenticationStatusChange();

  };

  (function(d){
    // load the Facebook javascript SDK

    var js,
    id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";

    ref.parentNode.insertBefore(js, ref);

  }(document));
  getUserInfo = function() {

  var _self = this;

  FB.api('/me', function(res) {
    $rootScope.$apply(function() {
      $rootScope.user = _self.user = res;
    });
  });

}

}]);
// $(document).ready(function(){

//  window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '113566229195740',
//       cookie     : true,
//       xfbml      : true,
//       version    : 'v2.8'
//     });
//     FB.AppEvents.logPageView();   
//   };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "//connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));
//   FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
// });
// FB.getLoginStatus(function(response) {
//   if (response.status === 'connected') {
//     console.log(response.authResponse.accessToken);
//   }
// });
// });
