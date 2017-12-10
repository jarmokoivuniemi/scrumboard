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
          cards : []
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
      });
    });

    describe('delete list when one list exists', function() {
      it('should have no list', function() {
        var list = addList('TODO');

        scope.deleteList(list);

        expect(scope.lists.length).toBe(0);

      });
      
    });

    describe('add card to list', function() {
      it('should have card inside list', function() {
        var list = addList('TODO');
        var card = {
          title: 'TDD AngularJS',
          description: '...or die trying'
        };

        scope.newCard = card;

        scope.addCard(scope.lists[0]);

        expect(scope.lists[0].cards.length).toBe(1);
        expect(scope.lists[0].cards[0].title).toBe('TDD AngularJS');
        expect(scope.lists[0].cards[0].description).toBe('...or die trying');


      });
      
    });

  });
});
