var scrumboardApp = angular.module('scrumboardApp', []);

scrumboardApp.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{a');
  $interpolateProvider.endSymbol('a}');
}]);

scrumboardApp.controller('scrumboardController', function($rootScope, $scope) {
  $scope.title = 'Scrumboard';

  $scope.lists = [];

  $scope.newCard = {
    title: undefined,
    description: undefined
  };

  $scope.newList = {
    name: undefined,
    cards: []
  };

  $scope.addList = function() {
    $scope.lists.push({
      name: $scope.newList.name,
      cards: $scope.newList.cards
    });
  };

  $scope.deleteList = function(listToDelete) {
    var index = $scope.lists.indexOf(listToDelete);
    $scope.lists.splice(index, 1);
  };

  $scope.addCard = function(list) {
    var index = $scope.lists.indexOf(list);
    $scope.lists[index].cards.push({
      title : $scope.newCard.title,
      description : $scope.newCard.description,
    });
  };
});
