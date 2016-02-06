import angular from 'angular'
import uiRouter from 'angular-ui-router'

import router from './router'
import homeController from './homeController'

let app = angular.module('app', [uiRouter])

app.config(router)
	.controller('homeController', homeController)

