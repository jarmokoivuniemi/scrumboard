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

    function postList(name, skip) {
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

    function postCard(listName, cardTitle) {
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

    it('should show scrumboard in title', function() {
      expect(scope.title).toBe('Scrumboard');
    });


    describe('no lists nor cards are added', function() {
      it('should have no lists', function() {
        expect(scope.lists.length).toBe(0);
      });

    });

    describe('list manipulations', function() {

      it('should not be able to add list without a name', function() {
        spyOn(window, 'alert');
        postList('');
        expect(scope.lists.length).toBe(0);
        expect(window.alert).toHaveBeenCalledWith("Add name to your list");
      });

      it('should have one list after add', function() {
        httpMock.expectPOST('/api/lists');
        postList('TODO');

        expect(scope.lists.length).toBe(1);
        expect(scope.lists[0].name).toBe('TODO');
        expect(scope.lists[0].cards).toEqual([]);

      });

      it('should not be able to add list with same name twice', function() {
        httpMock.expectPOST('/api/lists');
        spyOn(window, 'alert');
        postList('duplicate list');
        postList('duplicate list', true/*skip post*/);
        expect(scope.lists.length).toBe(1);
        expect(window.alert).toHaveBeenCalledWith("Can't add duplicate");

      });

      it('should have two lists after adding two', function() {
        httpMock.expectPOST('/api/lists');
        postList('TODO');
        postList('Doing');

        expect(scope.lists.length).toBe(2);
      });

      it('should have no list after delete', function() {
        var list = postList('TODO');

        httpMock.expectDELETE('/api/lists/TODO');
        scope.deleteList(list);

        httpMock.flush();

        expect(scope.lists.length).toBe(0);
      });
    });

    describe('card manipulations', function() {

      beforeEach(function() {
        postList('TODO');
        postList('Doing');
      });

      it('should not be possible to give card an empty title', function() {
        spyOn(window, 'alert');

        scope.addCard('TODO', '');

        expect(scope.lists[0].cards.length).toBe(0);
        expect(window.alert).toHaveBeenCalledWith("Add title to your card");
      });

      it('should add card', function() {
        httpMock.expectPOST('/api/cards');
        postCard('TODO', 'TDD AngularJS');

        expect(scope.lists[0].cards.length).toBe(1);
        expect(scope.lists[0].cards[0].title).toBe('TDD AngularJS');
        expect(scope.lists[0].cards[0].list).toBe('TODO');
      });

      it('should delete card', function() {
        postCard('TODO', 'TDD AngularJS');

        httpMock.expectDELETE('/api/cards/TDD AngularJS');
        scope.deleteCard(scope.lists[0].cards[0]);
        httpMock.flush();

        expect(scope.lists[0].cards.length).toBe(0);
      });

      it('should move card to another list', function() {
        postCard('TODO', 'TDD AngularJS');

        httpMock.expectPUT('/api/cards/TDD AngularJS');

        putCard(scope.lists[0].cards[0], 'Doing');

        expect(scope.lists[0].cards.length).toBe(0);
        expect(scope.lists[1].cards.length).toBe(1);
        expect(scope.lists[1].cards[0].list).toBe('Doing');
      });
    });
  });
});
