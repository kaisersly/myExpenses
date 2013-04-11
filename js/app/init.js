myExpenses.config(function ($routeProvider){
    $routeProvider
        .when("/tools", {
            controller: "ToolsCtrl",
            templateUrl: "templates/tools.html"
        })
        .when("/expenses", {
            controller: "ExpensesCtrl",
            templateUrl: "templates/expenses.html"
        })
        .when("/archives", {
            controller: "ArchivesCtrl",
            templateUrl: "templates/archives.html"
        })
        .when("/currencies", {
            controller: "CurrenciesCtrl",
            templateUrl: "templates/currencies.html"
        })
        .otherwise({
            redirectTo: "/tools"
        })
});