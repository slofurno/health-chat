router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

export default function router ($state, $url, $location) {
  $url.otherwise('/')

	$state
		.state('home', {
			url: '/',
			template: require('./view/home.html'),
			controller: 'homeController',
			controllerAs: 'vm'
		})

}
