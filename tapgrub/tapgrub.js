Taps = new Mongo.Collection('taps');

if (Meteor.isClient) {
 // this code only runs on the client
 angular.module('tapgrub',['angular-meteor']);

 angular.module('tapgrub').controller('TapCtrl', ['$scope', '$meteor',
  function ($scope, $meteor) {

    $scope.taps = $meteor.collection(function() {
      return Taps.find($scope.getReactively('query'), { sort: { createdAt: -1 } })
    });

    $scope.addTap = function (newTap) {
      $scope.taps.push( {
        text: newTap,
        createdAt: new Date()
      });
    };

    $scope.$watch('hideCompleted', function() {
      if ($scope.hideCompleted)
        $scope.query = {checked: {$ne: true}};
      else
        $scope.query = {};
    });

    $scope.incompleteCount = function() {
      return Taps.find({ checked: {$ne: true} }).count();
    };

  }]);
}
