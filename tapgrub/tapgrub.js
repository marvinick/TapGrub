if (Meteor.isClient) {
 // this code only runs on the client
 angular.module('tapgrub',['angular-meteor']);

 angular.module('tapgrub').controller('TapCtrl', ['$scope',
  function ($scope) {

    $scope.taps = [
      { text: 'This is task 1' },
      { text: 'This is task 2' },
      { text: 'This is task 3' }
    ];
  }]);
}
