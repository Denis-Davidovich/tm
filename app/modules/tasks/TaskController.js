define(function () {
    "use strict";

    var STORAGE_KEY = 'tasks';

    /**
     * Checking if localStorage is available
     *
     * @return {boolean}
     */
    function isLocalStorageAvailable() {
        try {
            var t = 'localStorage';
            return (t in window && window[t] !== null && (window[t].setItem(t, t), window[t].getItem(t) == t));
        } catch (e) {
            return false;
        }
    }

    var CAN_USE_STORAGE = isLocalStorageAvailable();

    /**
     * Get serialize string of tasks
     *
     * @return string
     */
    function getTasksSerialize(tasks) {
        return JSON.stringify(tasks);
    }

    /**
     * Save tasks in localStorage
     * @param tasks
     * @return {boolean}
     */
    function saveTasks(tasks) {
        if (!CAN_USE_STORAGE) {
            return false;
        }

        localStorage.setItem(STORAGE_KEY, getTasksSerialize(tasks));
        return true;
    }

    var TaskController = function ($scope) {

        var iNextId = 0;

        function getNextId() {
            return iNextId++;
        }

        $scope.statuses = {
            0: {value: 0, text: 'Ожидание'},
            1: {value: 1, text: 'В процессе'},
            2: {value: 2, text: 'Завершено'}
        };

        $scope.tasks = [];

        /**
         * Fill example data
         */
        $scope.example = function () {
            $scope.tasks = [
                {id: getNextId(), status: 0, name: 'Задача 0'},
                {id: getNextId(), status: 0, name: 'Задача 1'},
                {id: getNextId(), status: 1, name: 'Задача 2'},
                {id: getNextId(), status: 1, name: 'Задача 3'},
                {id: getNextId(), status: 2, name: 'Задача 4'},
                {id: getNextId(), status: 2, name: 'Задача 5'}
            ];
            saveTasks($scope.tasks);
        };

        /**
         * Add new task
         *
         * @param task
         * @return {boolean}
         */
        $scope.add = function (task) {

            if (!task || !task.name) {
                return false;
            }

            $scope.tasks.push({
                id: getNextId(),
                name: task.name,
                status: 0
            });

            task.name = '';
            task.status = 0;

            saveTasks($scope.tasks);
        };

        /**
         * Change status of task
         */
        $scope.change = function (task) {
            saveTasks($scope.tasks);
            console.log('change', task);
        };

        /**
         * Delete task
         *
         * @param task
         */
        $scope.del = function (task) {
            for (var iTask in $scope.tasks) {
                if (task.id == $scope.tasks[iTask].id) {
                    $scope.tasks.splice(iTask, 1);
                    break;
                }
            }
            saveTasks($scope.tasks);
        };

        /**
         * Load tasks from localStorage
         *
         * @return {boolean}
         */
        function loadTasks(isNeedApply) {

            if (!CAN_USE_STORAGE) {
                return false;
            }

            $scope.tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            iNextId = $scope.tasks.length;

            if (isNeedApply) {
                $scope.$apply();
            }

            return true;
        }

        /**
         * Handle for updates from localStorage
         *
         * @param Event
         */
        function onStorageUpdate(Event) {
            if (Event && Event.key == STORAGE_KEY) {
                loadTasks(true);
            }
        }

        window.addEventListener('storage', onStorageUpdate, false);

        loadTasks();
    };

    TaskController.$inject = ["$scope"];

    return TaskController;
});