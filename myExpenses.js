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
myExpenses.factory('expenseRenderer', function ($parse, $filter){  
    return function (expression, expense, changeList, currencyHash, to) {
        expense = expense.convert(changeList, to);
        var symbol = currencyHash[expense.currencyName];
        var text = $filter("currency")($parse(expression)(expense), symbol);
        return [text, expense.converted];
    }
});
function MyExpensesCtrl ($scope, $route) {
    $scope.$route = $route;
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
        new Currency("EUR", "€ "),
        new Currency("YEN", "¥ "),
        new Currency("USD", "$ ")
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
        document.querySelector("#newChange-rate").focus();
    }
    $scope.destroyChange = function (change) {
        $scope.$root.changeList.destroy(change.from, change.to);
    };
}
function ArchivesCtrl($scope) {
    $scope.$root.currentMenuItem = "#/archives";
}
function ExpensesCtrl($scope, expenseRenderer) {
    $scope.$root.currentMenuItem = "#/expenses";
    $scope.newExpense = new Expense("", "", "YEN", 1);
    $scope.expenseRenderer = function (price, expense) {
        return expenseRenderer(price, expense, $scope.$root.changeList, $scope.$root.currencyList.toHash(), $scope.$root.displayCurrency);
    };
    $scope.addExpense = function () {
        console.log("tt");
        if ($scope.newExpense.name && $scope.newExpense.quantity && $scope.newExpense.price) {
            $scope.$root.expenseList.add($scope.newExpense);
            $scope.newExpense = new Expense("", "", "YEN", 1);
            
        }
    };
    

}
function ToolsCtrl ($scope, $timeout) {
    $scope.$root.currentMenuItem = "#/tools";
    $scope.converter = {
        from: "YEN",
        to: "EUR",
        switchChange: function () {
            var oldFrom = this.from;
            this.from = this.to;
            this.to = oldFrom;
        }
    };
    ["converter.from", "converter.to"].forEach(function (expression) {
        $scope.$watch(expression, function (){
            $scope.converter.change = $scope.$root.changeList.find($scope.converter.from,$scope.converter.to);
            if ($scope.converter.change) {
                $scope.converter.notice = "";
            } else {
                $scope.converter.notice = "Convertisseur inconnu";
            }
        });
    });
    ["converter.from", "converter.to", "converter.value"].forEach(function (expression) {
        $scope.$watch(expression, function () {
            convert();
        });
    });
    function convert() {
        if ($scope.converter.change) {
            $scope.converter.converted = $scope.converter.change.convert($scope.converter.value);
        }
    }
}