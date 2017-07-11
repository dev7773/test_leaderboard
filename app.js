var app = angular.module("leaderboard");
var apipath = 'http://localhost:5000/public_html';

app.config(['$routeProvider', function (routeProvider) { 	
        routeProvider
                .when('/', {
                    redirectTo: 'home'
                })
                .when('/home', {
                    templateUrl: apipath + '/views/home.html',
                     controller: 'HomeController',
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]);

// app.config(['tableSortConfigProvider', function (tableSortConfigProvider) {
// 	console.log("hello")
//         //Globally configured filtering & pagination templates

//         /* Template Tokens - all are replaced by Angular expressions
//          * TOTAL_COUNT         - The number for the total count of items in the table
//          * FILTERED_COUNT      - The number for the total count of items in the table after the filter has been applied
//          * FILTER_STRING       - The string used for the `ng-model` of the text filter
//          * PER_PAGE_OPTIONS    - The array of numbers for the verious page size options
//          * ITEMS_PER_PAGE      - The number for the selected number of items to display per page (the selected item from PER_PAGE_OPTIONS)
//          * CURRENT_PAGE_NUMBER - The number for the page that is currently being viewed
//          * CURRENT_PAGE_RANGE  - The number for the current viewable range of pages
//          * ITEM_NAME_SINGULAR  - The singular version of the name of the items being iterated over
//          * ITEM_NAME_PLURAL    - The plural version of the name of the items being iterated over
//          */

//         var filterString = "<div class='row'>";
//         filterString += "<div class='col-sm-4 col-md-3 col-sm-offset-8 col-md-offset-9'>";
//         filterString += "<div class='form-group has-feedback'>";
//         filterString += "<input type='search' class='form-control' placeholder='filter {{ITEM_NAME_PLURAL}}' ng-model='FILTER_STRING'/>";
//         filterString += "<span class='glyphicon glyphicon-search form-control-feedback' aria-hidden='true'></span>";
//         filterString += "</div>";
//         filterString += "</div>";
//         filterString += "</div>";
//         tableSortConfigProvider.filterTemplate = filterString;

//         var pagerString = "<div class='col-md-12 mypager text-right'>";
//         pagerString += "<small class='text-muted'>Showing {{CURRENT_PAGE_RANGE}} {{FILTERED_COUNT === 0 ? '' : 'of'}} ";
//         pagerString += "<span ng-if='FILTERED_COUNT === TOTAL_COUNT'>{{TOTAL_COUNT | number}} {{TOTAL_COUNT === 1 ? ITEM_NAME_SINGULAR : ITEM_NAME_PLURAL}}</span>";
//         pagerString += "<span ng-if='FILTERED_COUNT !== TOTAL_COUNT'>{{FILTERED_COUNT | number}} {{FILTERED_COUNT === 1 ? ITEM_NAME_SINGULAR : ITEM_NAME_PLURAL}} (filtered from {{TOTAL_COUNT | number}})</span>";
//         pagerString += "</small>&nbsp;";
//         pagerString += "<uib-pagination style='vertical-align:top; margin-top:0;' ng-model='CURRENT_PAGE_NUMBER' total-items='FILTERED_COUNT' items-per-page='ITEMS_PER_PAGE' max-size='5' force-ellipses='true'></uib-pagination>";
//         pagerString += "&nbsp;";
//         pagerString += "<div class='form-group' style='display:inline-block;'><select class='pagination-height form-control' ng-model='ITEMS_PER_PAGE' ng-options='opt as (opt + \" per page\") for opt in PER_PAGE_OPTIONS'></select></div>";
//         pagerString += "</div>";
//         tableSortConfigProvider.paginationTemplate = pagerString;
//     }]);
