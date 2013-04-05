var myExpenses = angular.module("myExpenses", []);
myExpenses.config(function ($routeProvider){
    $routeProvider
        .when("/tools", {
            controller: "ToolsCtrl",
            templateUrl: "myExpenses-tools.html"
        })
        .when("/expenses", {
            controller: "ExpensesCtrl",
            templateUrl: "myExpenses-expenses.html"
        })
        .when("/archives", {
            controller: "ArchivesCtrl",
            templateUrl: "myExpenses-archives.html"
        })
        .when("/currencies", {
            controller: "CurrenciesCtrl",
            templateUrl: "myExpenses-currencies.html"
        })
        .otherwise({
            redirectTo: "/tools"
        })
});

function MyExpensesCtrl ($scope, $route) {
    $scope.$route = $route;
//    $scope.$root.$watch("currentMenuItem", function() {
//        console.log(a);
//    }, true);
    $scope.$root.menuItems = [
        {
            label: "Accueil",
            iconClass: "icon-home",
            href: "#/tools"
        },
        {
            label: "Dépenses",
            iconClass: "icon-list-alt",
            href: "#/expenses"
        },
        {
            label: "Archives",
            iconClass: "icon-calendar",
            href: "#/archives"
        },
        {
            label: "Devises",
            iconClass: "icon-globe",
            href: "#/currencies"
        }
    ];
    
    var currencies = [
        new Currency("EUR", "E"),
        new Currency("YEN", "Y"),
        new Currency("USD", "$")
    ];
    $scope.$root.currencyList = new CurrencyList(currencies);
    
    var changes = [
        new Change("EUR", "YEN", 120),
        new Change("EUR", "USD", 1.28)
    ];
    $scope.$root.changeList = new ChangeList(changes);
    
    var expenses = [
        new Expense("Avion", 900, "EUR", 1),
        new Expense("Hotel", 5000, "YEN", 10)
    ];
    $scope.$root.expenseList = new ExpenseList(expenses);
}

function CurrenciesCtrl($scope) {
    $scope.$root.currentMenuItem = "#/currencies";
    var changeList = $scope.$root.changeList;
    
    $scope.addChange = function (change) {
        if ($scope.editMode) {
            $scope.clearNewChange();
            return true;
        }
        change = change || $scope.newChange;
        changeList.add(change.from, change.to, change.rate);
        if (change == $scope.newChange) {
            $scope.clearNewChange();
        }
    };
    $scope.clearNewChange = function () {
        $scope.newChange = {};
        $scope.editMode = false;
    }
    $scope.editChange = function (change) {
        $scope.newChange = change;
        $scope.editMode = true;
        document.querySelector("input[type=\"number\"]").focus();
    }
    $scope.destroyChange = function (change) {
        $scope.$root.changeList.destroy(change.from, change.to);
    };
}
function ArchivesCtrl($scope) {
    $scope.$root.currentMenuItem = "#/archives";
}
function ExpensesCtrl($scope) {
    $scope.$root.currentMenuItem = "#/expenses";
    $scope.convertedExpense = [];
    $scope.convertToAll = function (expense, index) {
        $scope.convertedExpense[index] = $scope.$root.changeList.convert(expense.price, expense.currencyName);
    };
}
function ToolsCtrl ($scope) {
    $scope.$root.currentMenuItem = "#/tools";
    $scope.$watch("value", function (a, b) {
        if (a !== undefined) {
            if ($scope.currencyName) {
                $scope.convertedValue = $scope.$root.changeList.convert($scope.value, $scope.currencyName);
            }
        }
    });
}