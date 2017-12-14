var scrumboardApp = angular.module('scrumboardApp', []);

scrumboardApp.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{a');
  $interpolateProvider.endSymbol('a}');
}]);

scrumboardApp.controller('scrumboardController', function($rootScope, $scope, $http) {
  $scope.title = 'Scrumboard';

  $scope.lists = [];

  $http.get('/api/lists').then(function(response) {
    $scope.lists = response.data;
  });

  $scope.newCard = {
    title: undefined,
    description: undefined
  };

  $scope.newList = {
    name: undefined,
    cards: []
  };

  $scope.addList = function() {
    if(isValidList()) {
      list = {
          name: $scope.newList.name,
          cards: []
      };
      $http.post('/api/lists', list).then(function(response) {
        $scope.lists.push(response.data)
        });
      //$scope.lists.push(list);

    }
    else {
      cannotAddList();
    }
  };

  $scope.deleteList = function(listToDelete) {
    var index = getListIndex(listToDelete);
    $scope.lists.splice(index, 1);
  };

  $scope.addCard = function(listName, newTitle) {
    if(!newTitle) {
      alert('Add title to your card');
      return;
    }
    var index = getListIndexByName(listName);
    $scope.lists[index].cards.push({
      title : newTitle,
      description : "",
      list: listName
    });
  };

  $scope.deleteCard = function(card) {
    var listIndex = getListIndexByName(card.list);
    var cardIndex = $scope.lists[listIndex].cards.indexOf(card);
    $scope.lists[listIndex].cards.splice(cardIndex, 1);
  };

  $scope.moveCard = function(card, listName) {
    $scope.deleteCard(card);
    card.list = listName;
    var index = getListIndexByName(listName);
    $scope.lists[index].cards.push(card);
  };

  function getListIndex(list) {
    return $scope.lists.indexOf(list);
  };

  function getListIndexByName(listName) {
    return $scope.lists.indexOf($scope.lists.filter(function(list) {
      return list.name == listName;
    })[0]);
  };

  function listExists() {
    return $scope.lists.filter(function(list) {
      return list.name === $scope.newList.name;
    }).length > 0;
  };

  function isValidList() {
    return !listExists() && $scope.newList.name
  };

  function cannotAddList() {
  if(listExists())
    alert("Can't add duplicate");
  else if(!$scope.newList.name)
    alert("Add name to your list");
  };
});
