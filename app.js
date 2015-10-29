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

    

    /*----- LIVE DATA PAGE -----*/
    var liveZoneLight = [];
    var liveZoneTemp = [];

    for(i=0;i<3;i++){

        //Light
        liveZoneLight[i] = {};
        setChart('Gauge', liveZoneLight[i], 'light');
        listenLive('zone' + (i+1), liveZoneLight[i], 'light');

        //Temperature
        liveZoneTemp[i] = {};
        setChart('Gauge', liveZoneTemp[i], 'temp');
        listenLive('zone' + (i+1), liveZoneTemp[i], 'temp');
    
    }

    //Zone 1 Light & Temp
    $rootScope.liveLight1 = liveZoneLight[0];
    $rootScope.liveTemp1 = liveZoneTemp[0];

    //Zone 2 Light & Temp
    $rootScope.liveLight2 = liveZoneLight[1];
    $rootScope.liveTemp2 = liveZoneTemp[1];

    //Zone 3 Light & Temp
    $rootScope.liveLight3 = liveZoneLight[2];
    $rootScope.liveTemp3 = liveZoneTemp[2];


    //----------TESTING----------//
    var liveLightTest = {};
    liveLightTest.type = "AnnotationChart";

    liveLightTest.data = {
        "cols": [
            {id: "week", label: "Week", type: "date"},
            {id: "light-data", label: "Light (lm)", type: "number"}
        ], 
        "rows": []
    };

    ref.child('zone1').limitToLast(7).on('child_added', function(snapshot){
        var data = snapshot.val();
        var timestamp = new Date(data.timestamp);

        liveLightTest.data.rows.push(
            {c: [
                {v: new Date(timestamp)},
                {v: data.light },
            ]}
        );


    });
    
    liveLightTest.options = {
        displayAnnotations: false,
        zoomButtonsOrder: ['1-hour', 'max'],
        colors: ['#00FF00','#00FF00','#00FF00']
    };

    $rootScope.liveLightTest = liveLightTest;

    /*----- HISTORY PAGE -----*/
    var zoneLight = [];
    var zoneTemp = [];

    for(i=0;i<3;i++){
        //Zone's light
        zoneLight[i] = {};

        zoneLight[i].type = "AnnotationChart";

        zoneLight[i].data = {
            "cols": [
                {id: "week", label: "Week", type: "date"},
                {id: "light-data", label: "Light (lm)", type: "number"}], 
            "rows": []
        };

        pushData('zone' + (i+1) + 'hourly', zoneLight[i], 'light');

        zoneLight[i].options = {
            displayAnnotations: false,
            zoomButtonsOrder: ['1-hour', 'max'],
        };

        //Zone's Temperature
        zoneTemp[i] = {};

        zoneTemp[i].type = "AnnotationChart";

        zoneTemp[i].data = {
        "cols": [
            {id: "week", label: "Week", type: "date"},
            {id: "temp-data", label: "Temp (°C)", type: "number"}], 
        "rows": []};

        pushData('zone' + (i+1) + 'hourly', zoneTemp[i], 'temp');

        zoneTemp[i].options = {
            displayAnnotations: false,
            zoomButtonsOrder: ['1-hour', 'max'],
            colors: ['#FF0000','#FF0000','#FF0000']
        };
    }

    $rootScope.zone1light = zoneLight[0];
    $rootScope.zone2light = zoneLight[1];
    $rootScope.zone3light = zoneLight[2];

    $rootScope.zone1temp = zoneTemp[0];
    $rootScope.zone2temp = zoneTemp[1];
    $rootScope.zone3temp = zoneTemp[2];

})

//Live Data Controller
spotApp.controller('liveController', ['$scope','$firebaseArray',
function($scope, $firebaseArray){


}]);

//History Controller
spotApp.controller('historyController', ['$scope','$firebaseObject',
function($scope, $firebaseObject) {

}]);

//Sensors Controller
spotApp.controller('sensorsController', ['$scope', 'location',
function($scope, $location){

}]);


//Functions

function setChart(chartType, object, type){
    
    object.type = chartType;

    if(type==='light'){
        object.options = {
            max: 3000,
            width: 400, height: 120,
            yellowFrom:1000, yellowTo: 1500,
            redFrom: 1500, redTo: 3000,
            minorTicks: 5,
            animation:{
                duration: 1000,
                easing: 'out',
            }
        };
    }
    if(type==='temp'){
        object.options = {
            max: 60,
            width: 400, height: 120,
            yellowFrom:20, yellowTo: 40,
            redFrom: 40, redTo: 60,
            minorTicks: 5,
            animation:{
                duration: 1000,
                easing: 'out',
            }
        };
    }
    
}

function listenLive(childName, object, type){
    ref.child(childName).limitToLast(1).on('child_added', function(snapshot){
        var data = snapshot.val();
        var light = Math.round(data.light * 100) / 100; //Round up to 2 decimal places
        var temp = Math.round(data.temp * 100) / 100; //Round up to 2 decimal places
        if(type==='light'){
            object.data = [
                ['Label', 'Value'],
                ['Light (lm)', light]
            ];
        }
        if(type==='temp'){
            object.data = [
                ['Label', 'Value'],
                ['Temp (°C)', temp]
            ];
        }
    });
}
function pushData(childName, object, type){
    ref.child(childName).on("value", function(snapshot){
        snapshot.forEach(function(data){
            var timestamp = new Date(data.val().timestamp);

            if(type==='light'){
                object.data.rows.push(
                    {c: [
                        {v: new Date(timestamp)},
                        {v: data.val().light },
                    ]}
                );
            }

            if(type==='temp'){
                object.data.rows.push(
                    {c: [
                        {v: new Date(timestamp)},
                        {v: data.val().temp },
                    ]}
                );
            }

        });
    });
}