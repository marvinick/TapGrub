Taps = new Mongo.Collection('taps');

if (Meteor.isClient) {
 // this code only runs on the client
 angular.module('tapgrub',['angular-meteor']);

 angular.module('tapgrub').controller('TapCtrl', ['$scope', '$meteor',
  function ($scope, $meteor) {

    $scope.taps = $meteor.collection(Taps);

    $scope.addTap = function (newTap) {
      $scope.taps.push( {
        text: newTap,
        createdAt: new Date()
      });
    };

  }]);
}
