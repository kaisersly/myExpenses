myExpenses.factory('Store', function () {
    return function (name) {
        var Store = {
            name: name
        };
        Store.load = function (key) {
            return angular.fromJson(window.localStorage[Store.name + "_" + key]);
        };
        Store.save = function (key, data) {
            window.localStorage[Store.name + "_" + key] = angular.toJson(data);
        };
        return Store;
    };
});