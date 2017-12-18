describe('Scrumboard', function() {

  beforeEach(module('scrumboardApp'));

  describe('scrumboard', function() {

    var ctrl, scope, httpMock, listPost, cardPost, cardPut;

    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      ctrl = $controller('scrumboardController', {$scope:scope});
      httpMock = $httpBackend;
      httpMock.when('GET', '/api/lists')
        .respond([]);
      listPost = httpMock.whenPOST('/api/lists');
      httpMock.when('DELETE', '/api/lists/TODO').respond({});
      cardPost = httpMock.when('POST', '/api/cards');
      httpMock.when('DELETE', '/api/cards/TDD AngularJS').respond({});
      cardPut = httpMock.when('PUT', '/api/cards/TDD AngularJS');

    }));

    function addList(name, skip) {
      listPost.respond({
        name: name,
        cards: []
      });
      var list = {
        name : name,
        cards : undefined
      };
      scope.newList = list
      scope.addList()

      if(!skip)
        httpMock.flush(skip);

      return list;
    }

    function addCardToList(listName, cardTitle) {
      cardPost.respond({
        title: cardTitle,
        description: '',
        list: listName
      });
      scope.addCard(listName, cardTitle);
      httpMock.flush();

    };

    function putCard(card, newListName) {
      cardPut.respond({
        title: 'TDD AngularJS',
        description: '',
        list: 'Doing'
      });

      scope.moveCard(scope.lists[0].cards[0], 'Doing');
      httpMock.flush();

    };

    it('shows scrumboard in title', function() {
      expect(scope.title).toBe('Scrumboard');
    });

    describe('list manipulations', function() {

      it('is not possible to add a list without a name', function() {
        spyOn(window, 'alert');

        addList('');

        expect(scope.lists.length).toBe(0);
        expect(window.alert).toHaveBeenCalledWith("Add name to your list");
      });

      it('has one list after list is added', function() {
        httpMock.expectPOST('/api/lists');
        addList('TODO');

        expect(scope.lists.length).toBe(1);
        expect(scope.lists[0].name).toBe('TODO');
        expect(scope.lists[0].cards).toEqual([]);

      });

      it('is not possible to add duplicate list', function() {
        httpMock.expectPOST('/api/lists');
        spyOn(window, 'alert');

        addList('duplicate list');
        addList('duplicate list', true/*skip post*/);

        expect(scope.lists.length).toBe(1);
        expect(window.alert).toHaveBeenCalledWith("Can't add duplicate");

      });

      it('has two lists after adding two', function() {
        httpMock.expectPOST('/api/lists');
        addList('TODO');
        addList('Doing');

        expect(scope.lists.length).toBe(2);
      });

      it('has no lists after deleting', function() {
        var list = addList('TODO');

        httpMock.expectDELETE('/api/lists/TODO');
        scope.deleteList(list);

        httpMock.flush();

        expect(scope.lists.length).toBe(0);
      });
    });

    describe('card manipulations', function() {

      beforeEach(function() {
        addList('TODO');
        addList('Doing');
      });

      it('is not possible to add a card with empty title', function() {
        spyOn(window, 'alert');

        scope.addCard('TODO', '');

        expect(scope.lists[0].cards.length).toBe(0);
        expect(window.alert).toHaveBeenCalledWith("Add title to your card");
      });

      it('adds card to list', function() {
        httpMock.expectPOST('/api/cards');
        addCardToList('TODO', 'TDD AngularJS');

        expect(scope.lists[0].cards.length).toBe(1);
        expect(scope.lists[0].cards[0].title).toBe('TDD AngularJS');
        expect(scope.lists[0].cards[0].list).toBe('TODO');
      });

      it('deletes card from list', function() {
        addCardToList('TODO', 'TDD AngularJS');

        httpMock.expectDELETE('/api/cards/TDD AngularJS');
        scope.deleteCard(scope.lists[0].cards[0]);
        httpMock.flush();

        expect(scope.lists[0].cards.length).toBe(0);
      });

      it('moves card to another list', function() {
        addCardToList('TODO', 'TDD AngularJS');

        httpMock.expectPUT('/api/cards/TDD AngularJS');

        putCard(scope.lists[0].cards[0], 'Doing');

        expect(scope.lists[0].cards.length).toBe(0);
        expect(scope.lists[1].cards.length).toBe(1);
        expect(scope.lists[1].cards[0].list).toBe('Doing');
      });
    });
  });
});
