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
      it('should have no lists', function() {
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

      it('should not be able to add list with same name twice', function() {
        spyOn(window, 'alert');
        addList('duplicate list');
        addList('duplicate list');
        expect(scope.lists.length).toBe(1);
        expect(window.alert).toHaveBeenCalledWith("Can't add duplicate");

      });
    });

    describe('delete list when one list exists', function() {
      it('should have no list', function() {
        var list = addList('TODO');

        scope.deleteList(list);

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
        scope.addCard('Doing', 'Find bugs in HTML');

        expect(scope.lists[0].cards.length).toBe(1);
        expect(scope.lists[0].cards[0].title).toBe('TDD AngularJS');
        expect(scope.lists[0].cards[0].list).toBe('TODO');
        expect(scope.lists[1].cards.length).toBe(1);
        expect(scope.lists[1].cards[0].title).toBe('Find bugs in HTML');
        expect(scope.lists[1].cards[0].list).toBe('Doing');

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
