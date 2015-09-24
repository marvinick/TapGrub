Taps = new Mongo.Collection('taps');

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

 // this code only runs on the client
 angular.module('tapgrub',['angular-meteor']);

 angular.module('tapgrub').controller('TapCtrl', ['$scope', '$meteor',
  function ($scope, $meteor) {

    $scope.taps = $meteor.collection(function() {
      return Taps.find($scope.getReactively('query'), { sort: { createdAt: -1 } })
    });

    $scope.addTap = function (newTap) {
      $meteor.call('addTap', newTap);
    };

    $scope.deleteTap = function (tap) {
      $meteor.call('deleteTap', tap_id);
    };

    $scope.setChecked = function (tap) {
      $meteor.call('setChecked', tap._id, !tap.checked);

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

Meteor.methods({
  addTap: function (text) {
    //make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }

    Tap.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTap: function (tapId) {
    Taps.remove(tapId);
  },
  setChecked: function (tapId, setChecked) {
    Taps.update(tapId, { $set: { checked: setChecked} });
  }
})
