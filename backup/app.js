//modules
var spotApp = angular.module('spotApp', ['ngRoute', 'ngResource', 'firebase', 'googlechart']);
var ref = new Firebase("https://sunsspot.firebaseio.com");

//Routes
spotApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/livedata', {templateUrl: 'pages/livedata.html', controller: 'liveController'})
        .when('/history', {templateUrl: 'pages/history.html', controller: 'historyController'})
        .when('/sensors', {templateUrl: 'pages/sensors.html', controller: 'sensorsController'})
        .otherwise({ redirectTo: '/livedata' });

        $locationProvider.html5Mode(true).hashPrefix('!');
});

//Think it as global variables
spotApp.run(function($rootScope, $firebaseObject){
    $rootScope.appName = 'JALP SmartLab';
    
    $rootScope.livedata = $firebaseObject(ref.child('zone1').limitToLast(1));
    $rootScope.livedata2 = $firebaseObject(ref.child('zone2').limitToLast(1));
    $rootScope.livedata3 = $firebaseObject(ref.child('zone3').limitToLast(1));
    
    $rootScope.zone1hourly = $firebaseObject(ref.child('zone1hourly'));
    $rootScope.zone2hourly = $firebaseObject(ref.child('zone2hourly'));
    $rootScope.zone3hourly = $firebaseObject(ref.child('zone3hourly'));
})

//Controllers
spotApp.controller('liveController', ['$scope','$firebaseArray',
function($scope, $firebaseArray){


}]);

spotApp.controller('historyController', ['$scope','$firebaseObject',
function($scope, $firebaseObject) {

}]);

spotApp.controller('sensorsController', ['$scope', 'location',
function($scope, $location){

}]);

spotApp.controller('MainCtrl', ['$scope', '$firebaseObject', 
function($scope, $firebaseObject){

    var chartObject = {};
    
    chartObject.type = "AnnotationChart";

    $scope.secondRow = [
            {v: new Date(2015, 2, 16)},
            {v: 13},
            // {v: 'Lalibertines'},
            // {v: 'They are very tall'},
            {v: 25},
            {v: 25},
            {v: 25},
            {v: 25},
            // {v: 'Gallantors'},
            // {v: 'First Encounter'}
        ];

    chartObject.data = {
    "cols": 
    [
        {id: "week", label: "Week", type: "date"},
        
        {id: "light-data", label: "Light", type: "number"},
        {id: "temp-data", label: "temp", type: "number"},
        {id: "temp2-data", label: "temp2", type: "number"},
        {id: "temp3-data", label: "temp3", type: "number"},
        
    ], 
    "rows": 
    [
        {c: [
            {v: new Date(2015, 2, 10)},
            
            {v: 19 },
            {v: 30 },
            {v: 30 },
            {v: 30 },
            {v: 30 },
        ]},
        {c: $scope.secondRow},
        {c: [
            {v: new Date(2015, 2, 17)},
            {v: 100},
            {v: 30 },
            {v: 30 },
            {v: 30 },
            {v: 30 },
        ]},
        {c: [
            {v: new Date(2015, 2, 18)},
            {v: 1000},
            {v: 30 },
            {v: 30 },
            {v: 30 },
            {v: 30 },
        ]},
        {c: [
            {v: new Date(2015, 2, 19)},
            {v: 500},
            {v: 30 },
            {v: 30 },
            {v: 30 },
            {v: 30 },

        ]},
        {c: [
            {v: new Date(2015, 2, 20)},
            {v: 30},
            {v: 30 },
            {v: 30 },
            {v: 30 },
            {v: 30 },
        ]},
    ]};

    chartObject.options = {
        displayAnnotations: false,
        zoomButtonsOrder: ['1-hour', '1-day', '1-week']
    };

    $scope.chart = chartObject;

}]);

// spotApp.controller('MainCtrl', function($scope) {
//     var chartObject = {};
    
//     chartObject.type = "PieChart";
    
//     chartObject.data = [
//        ['Component', 'cost'],
//        ['Software', 50000],
//        ['Hardware', 80000]
//       ];
//     chartObject.data.push(['Services',20000]);
//     chartObject.options = {
//         displayExactValues: true,
//         width: 400,
//         height: 200,
//         is3D: true,
//         chartArea: {left:10,top:10,bottom:0,height:"100%"}
//     };

//     chartObject.formatters = {
//       number : [{
//         columnNum: 1,
//         pattern: "$ #,##0.00"
//       }]
//     };

//     $scope.chart = chartObject;

//     $scope.aa=1*$scope.chart.data[1][1];
//     $scope.bb=1*$scope.chart.data[2][1];
//     $scope.cc=1*$scope.chart.data[3][1];
// });

// spotApp.controller('His1Ctrl', ['$scope', 
// function($scope){
//     var chartObject = {};

//     var chartObject.type = "";

// }]);