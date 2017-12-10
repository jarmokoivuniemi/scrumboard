describe('Scrumboard', function() {

  beforeEach(module('scrumboardApp'));

  describe('scrumboard', function() {

    var ctrl, scope;

    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('scrumboardController', {$scope:scope});
    }));

    function addList(name) {
        var list = {
          name : name,
          cards : undefined
        };
        scope.newList = list
        scope.addList()

        return list;
    }

    it('should show scrumboard in title', function() {
      expect(scope.title).toBe('Scrumboard');
    });


    describe('no lists nor cards are added', function() {
      it('should have no list', function() {
        expect(scope.lists.length).toBe(0);
      });

    });

    describe('add list', function() {
      it('should have one list', function() {
        addList('TODO');

        expect(scope.lists.length).toBe(1);
        expect(scope.lists[0].name).toBe('TODO');
        expect(scope.lists[0].cards).toEqual([]);

      });
    });

    describe('delete list when one list exists', function() {
      it('should have no list', function() {
        var list = addList('TODO');

        scope.deleteList(list);

        expect(scope.lists.length).toBe(0);

      });
    });

    describe('add two cards to list', function() {
      it('should have card inside list', function() {

        addList('TODO');
        addList('Doing');

        scope.addCard(scope.lists[0], 'TDD AngularJS');
        scope.addCard(scope.lists[1], 'Find bugs in HTML');

        expect(scope.lists[0].cards.length).toBe(1);
        expect(scope.lists[0].cards[0].title).toBe('TDD AngularJS');
        expect(scope.lists[1].cards.length).toBe(1);
        expect(scope.lists[1].cards[0].title).toBe('Find bugs in HTML');

      });
    });

  });
});
