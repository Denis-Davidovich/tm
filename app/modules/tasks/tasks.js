define(['angular', 'tasks/TaskController'], function (angular, TaskController) {
    "use strict";

    var tasks = angular.module("tasks", []);
    tasks.controller("TaskController", TaskController);

    return tasks;
});