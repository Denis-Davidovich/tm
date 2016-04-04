(function (require) {
	"use strict";
	require.config({
		paths: {
			'angular': '../../bower_components/angular/angular'
		},
		shim: {
			'angular': { deps: [], exports: 'angular' }
		}
	});

	require(["angular", "app"], function () {
		angular.bootstrap(document, ["app"]);
	});
}(require));