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

  $scope.newList = {
    name: undefined,
    cards: []
  };

  $scope.addList = function() {
    if(isNewListValid()) {
      list = {
          name: $scope.newList.name,
          cards: []
      };
      $http.post('/api/lists', list).then(function(response) {
        $scope.lists.push(response.data)
        });
    }
    else {
      cannotAddList();
    }
  };

  $scope.deleteList = function(listToDelete) {
    $http.delete('/api/lists/'+listToDelete.name, listToDelete).then(function(response) {
      var index = getListIndex(listToDelete);
      $scope.lists.splice(index, 1);
    });
  };

  $scope.addCard = function(listName, newTitle) {
    if(!newTitle) {
      alert('Add title to your card');
      return;
    }
    card = {
      title : newTitle,
      description : "",
      list: listName
    }
    $http.post('/api/cards', card).then(function(response) {
      var index = getListIndexByName(listName);
      $scope.lists[index].cards.push(response.data);
    });
  };

  $scope.deleteCard = function(card) {
    $http.delete('/api/cards/'+card.title).then(function() {
      removeCardFromList(card);
    });
  };

  $scope.moveCard = function(card, listName) {
    editedCard = {
      title: card.title,
      description: card.description,
      list: listName
    }

    $http.put('/api/cards/'+card.title, editedCard).then(function() {
      removeCardFromList(card);
      console.log($scope.lists);
      card.list = listName;
      var index = getListIndexByName(listName);
      $scope.lists[index].cards.push(card);
    });
  };

  function removeCardFromList(card) {
    var listIndex = getListIndexByName(card.list);
    var cardIndex = $scope.lists[listIndex].cards.indexOf(card);
    $scope.lists[listIndex].cards.splice(cardIndex, 1);
  };

  function getListIndex(list) {
    return $scope.lists.indexOf(list);
  };

  function getListIndexByName(listName) {
    return $scope.lists.indexOf($scope.lists.filter(list => list.name == listName)[0]);
  };

  function listExists() {
    return $scope.lists.filter(list => list.name == $scope.newList.name).length > 0;
  };

  function isNewListValid() {
    return !listExists() && $scope.newList.name
  };

  function cannotAddList() {
  if(listExists())
    alert("Can't add duplicate");
  else if(!$scope.newList.name)
    alert("Add name to your list");
  };
});
