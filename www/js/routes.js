angular.module('ionic-camera.routes', [])
  // routes config
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('camera', {
      url: "/camera",
      templateUrl: "templates/camera.html",
      controller: 'HomeCtrl'
    });

    $urlRouterProvider.otherwise("/camera");
  })

