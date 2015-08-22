/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngAusterity.home', [
  'ui.router',
  'ngStorage',
  'plusOne'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function HomeController(
  $scope, $localStorage
) {
  $scope.model = {
    log: [],
    candraw: true,
    bag: [],
    current: [],
    used: [],
    tresory: [],
    employment: 5,
    public_safety: 5,
    wealth: 5,
    health: 5,
    popularity: 5,
    private_enterprise_cuts: 0,
    national_security_cuts: 0,
    social_welfare_cuts: 0,
    private_enterprise_fin: [],
    national_security_fin: [],
    social_welfare_fin: []
  };
  if ($localStorage['ngAusterity']) {
    $scope.model = angular.copy($localStorage);
    $scope.model.log.unshift("Game loaded from localStorage.");
  } else {
    $scope.model.bag = ['b', 'b', 'b', 'b', 'r', 'r', 'u', 'u', 'w', 'y'];
    $scope.model.log.unshift("Game initialized");
  }
  $scope.drawOne = function(collection) {
    return _.pullAt(collection, _.random(collection.length-1))[0];
  };
  $scope.draw = function() {
    if ($scope.model.bag.length === 1) {
      $scope.model.used.push($scope.model.bag.pop());
      $scope.model.log.unshift("Only one cube left in the bag, the cube goes to 'Used' without being resolved.");
    } else {
      // Draw two
      var cube = $scope.drawOne($scope.model.bag);
      $scope.model.log.unshift("Cube '" + cube + "' drawn from bag.");
      $scope.model.current.push(cube);
      cube = $scope.drawOne($scope.model.bag);
      $scope.model.log.unshift("Cube '" + cube + "' drawn from bag.");
      $scope.model.current.push(cube);
    }
    $scope.model.candraw = false;
  };
  $scope.resolve = function() {
    var current = angular.copy($scope.model.current);
    current = _(current).sort().join('');
    if (current === 'bb') {
      $scope.model.log.unshift("Economic Downturn : reduce Wealth by one and increase cuts on every institution by one.");
      $scope.model.wealth -= 1;
      $scope.model.private_enterprise_cuts += 1;
      $scope.model.national_security_cuts += 1;
      $scope.model.social_welfare_cuts += 1;
    } else if (current === 'bu') {
      $scope.model.log.unshift("Underfunded Police Force : (TODO spend Y or) add R.");
      $scope.model.used.push('r');
    } else if (current === 'br') {
      $scope.model.log.unshift("Political corruption: decrease Popularity by one.");
      $scope.model.popularity -= 1;
    } else if (current === 'ry') {
      $scope.model.log.unshift("Anti-austerity Protests: (TODO either Remove Y and R or) increase Popularity by one and add B.");
      $scope.model.popularity += 1;
      $scope.model.used.push('b');
    } else if (current === 'rr') {
      $scope.model.log.unshift("Industrial Violations: decrease Public Safety by two");
      $scope.model.public_safety -= 2;
    } else if (current === 'rw') {
      $scope.model.log.unshift("Welfare Cheats: decrease Employment by one.");
      $scope.model.employment -= 1;
    } else if (current === 'ww') {
      $scope.model.log.unshift("Back-to-Work Programme: increase Employment by two.");
      $scope.model.employment += 2;
    } else if (current === 'yy') {
      $scope.model.log.unshift("Budget Surplus: increate Wealth by one; (TODO may spend both cubes to fund a single already-funded institution).");
      $scope.model.wealth += 1;
    } else if (current === 'by') {
      $scope.model.log.unshift("Early Repayments: (TODO Optionnaly Spend Y to Remove B).");
    } else if (current === 'uy') {
      $scope.model.log.unshift("Security Spending: increate Popularity (TODO or Public Safety by one).");
      $scope.model.popularity += 1;
    } else if (current === 'uu') {
      $scope.model.log.unshift("Falling Crime Rates: increase Public Safety by two.");
      $scope.model.public_safety += 2;
    } else if (current === 'ru') {
      $scope.model.log.unshift("Special Operations: (TODO either Remove U and R or) reduce Public Safety by one.");
      $scope.model.public_safety -= 1;
    } else if (current === 'uw') {
      $scope.model.log.unshift("Welfare Cheat Crackdown: (either Remove W or) increase Employment by one and decrease Popularity by one.");
      $scope.model.employment += 1;
      $scope.model.popularity -= 1;
    } else if (current === 'wy') {
      $scope.model.log.unshift("Nationalised Healthcare Spending: increase Health by two.");
      $scope.model.health += 2;
    } else if (current === 'bw') {
      $scope.model.log.unshift("Welfare Budget Problems: (TODO Spend Y or) reduce Health by one.");
      $scope.model.health -= 1;
    }
    $scope.model.used.push($scope.drawOne($scope.model.current));
    $scope.model.used.push($scope.drawOne($scope.model.current));
    $scope.model.candraw = true;
  };
  $scope.borrow = function() {
    $scope.model.log.unshift("Borrow money : add YY to bag B.");
    $scope.model.used.push('y');
    $scope.model.used.push('y');
    $scope.model.bag.push('b');
  };
  $scope.taxes = function() {
    $scope.model.log.unshift("Raise taxes : add to bag R, Y.");
    $scope.model.bag.push('r');
    $scope.model.bag.push('y');
  };
  $scope.payloan = function() {
    $scope.model.log.unshift("Pay loan : (TODO remove YYB).");
    // TODO
  };
})

;

