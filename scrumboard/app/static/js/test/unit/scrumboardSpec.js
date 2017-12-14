describe('Scrumboard', function() {

  beforeEach(module('scrumboardApp'));

  describe('scrumboard', function() {

    var ctrl, scope, httpMock;

    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      ctrl = $controller('scrumboardController', {$scope:scope});
      httpMock = $httpBackend;
      httpMock.when('GET', '/api/lists')
        .respond([]);
      testPost = httpMock.whenPOST('/api/lists');
      httpMock.when('DELETE', '/api/lists/TODO').respond({});
    }));

    function addList(name, skip) {
      testPost.respond({
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

    it('should show scrumboard in title', function() {
      expect(scope.title).toBe('Scrumboard');
    });


    describe('no lists nor cards are added', function() {
      it('should have no lists', function() {
        expect(scope.lists.length).toBe(0);
      });

    });

    describe('add list', function() {

      it('should not be able to add list without a name', function() {
        spyOn(window, 'alert');
        addList('');
        expect(scope.lists.length).toBe(0);
        expect(window.alert).toHaveBeenCalledWith("Add name to your list");
      });

      it('should have one list', function() {
        httpMock.expectPOST('/api/lists');
        addList('TODO');

        expect(scope.lists.length).toBe(1);
        expect(scope.lists[0].name).toBe('TODO');
        expect(scope.lists[0].cards).toEqual([]);

      });

      it('should not be able to add list with same name twice', function() {
        httpMock.expectPOST('/api/lists');
        spyOn(window, 'alert');
        addList('duplicate list');
        addList('duplicate list', true);
        expect(scope.lists.length).toBe(1);
        expect(window.alert).toHaveBeenCalledWith("Can't add duplicate");

      });

      it('should add two lists', function() {
        httpMock.expectPOST('/api/lists');
        addList('TODO');
        addList('Doing');

        expect(scope.lists.length).toBe(2);
      });
    });

    describe('delete list when one list exists', function() {
      it('should have no list', function() {
        var list = addList('TODO');

        httpMock.expectDELETE('/api/lists/TODO');
        scope.deleteList(list);

        httpMock.flush();

        expect(scope.lists.length).toBe(0);

      });
    });

    describe('adding and deleting cards', function() {

      beforeEach(function() {
        addList('TODO');
        addList('Doing');
      });

      it('should not be possible to give empty title', function() {
        spyOn(window, 'alert');

        scope.addCard('TODO', '');

        expect(scope.lists[0].cards.length).toBe(0);
        expect(window.alert).toHaveBeenCalledWith("Add title to your card");

      });

      it('should have card inside list', function() {
        scope.addCard('TODO', 'TDD AngularJS');

        expect(scope.lists[0].cards.length).toBe(1);
        expect(scope.lists[0].cards[0].title).toBe('TDD AngularJS');
        expect(scope.lists[0].cards[0].list).toBe('TODO');

      });

      it('should delete card', function() {
        scope.addCard(scope.lists[0].name, 'TDD AngularJS');

        scope.deleteCard(scope.lists[0].cards[0]);

        expect(scope.lists[0].cards.length).toBe(0);

      });
    });

  describe('moving cards', function() {
    it('card should be moved to other list', function() {
      addList('TODO');
      addList('Doing');
      scope.addCard('TODO', 'TDD AngularJS');

      scope.moveCard(scope.lists[0].cards[0], 'Doing');

      expect(scope.lists[0].cards.length).toBe(0);
      expect(scope.lists[1].cards.length).toBe(1);
      expect(scope.lists[1].cards[0].list).toBe('Doing');
    });
  });

  });
});
