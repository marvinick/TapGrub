Taps = new Mongo.Collection('taps');

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

 // this code only runs on the client
 angular.module('tapgrub',['angular-meteor']);

 angular.module('tapgrub').controller('TapCtrl', ['$scope', '$meteor',
  function ($scope, $meteor) {

    $scope.$meteorSubscribe('taps');

    $scope.taps = $meteor.collection(function() {
      return Taps.find($scope.getReactively('query'), { sort: { createdAt: -1 } })
    });

    $scope.addTap = function (newTap) {
      $meteor.call('addTap', newTap);
    };

    $scope.deleteTap = function (tap) {
      $meteor.call('deleteTap', tap._id);
    };

    $scope.setChecked = function (tap) {
      $meteor.call('setChecked', tap._id, !tap.checked);

    $scope.setPrivate = function (tap) {
      $meteor.call('setPrivate', tap._id, ! tap.private);
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
    var tap = Taps.findOne(tapId);
    if (tap.private && tap.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Taps.remove(tapId);
  },
  setChecked: function (tapId, setChecked) {
    var tap = Taps.findOne(tapId);
    if (tap.private && tap.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Taps.update(tapId, { $set: { checked: setChecked} });
  },
  setPrivate: function (tapId, setToPrivate) {
    var tap = Taps.findOne(tapId);

    // make sure only the tap owner can make a tap private
    if (tap.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Taps.update(tapId, { $set: { private: setToPrivate } });
  }
});

if (Meteor.isServer) {
  Meteor.publish('taps', function () {
    return Taps.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}

