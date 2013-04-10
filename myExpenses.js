function Store (name) {
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
}

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
myExpenses.factory('totals', function ($parse, $filter){  
    return function (expression, expenseList, changeList, displayCurrency, currencyHash) {
        var expenses = {},
            totals = [];
        Object.keys(currencyHash).forEach(function (currencyName) {
            expenses[currencyName] = 0;
        });
        expenseList.expenses.forEach(function (expense) {
            var currentExpense;
            if (displayCurrency && displayCurrency != "") {
                currentExpense = expense.convert(changeList, displayCurrency);
            } else {
                currentExpense = expense;
            }
            if ($parse(expression)(expense)) {
                expenses[currentExpense.currencyName] += currentExpense.total();
            }
        });
        angular.forEach(expenses, function (value, key) {
            var symbol = currencyHash[key];
            if (value > 0) {
                totals.push($filter("currency")(value, symbol));
            }
        });
        return totals;
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
    function loadFixtures () {
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
            new Expense("Hotel", 5000, "YEN", 10),
            new Expense("Avion", 900, "EUR", 1),
            new Expense("Hotel", 5000, "YEN", 10),
            new Expense("Hotel", 5000, "YEN", 10)
        ];
        expenses[2].archivedAt = new Date(2013,04,10);
        expenses[3].archivedAt = new Date(2013,04,10);
        expenses[4].archivedAt = new Date(2013,04,11);
        $scope.$root.expenseList = new ExpenseList(expenses);
    }
    
    $scope.$root.store = new Store("myExpenses");
    $scope.$root.store.load();
    
    function loadFromStore() {
        $scope.$root.currencyList = new CurrencyList();
        $scope.$root.changeList = new ChangeList();
        $scope.$root.expenseList = new ExpenseList();
        $scope.$root.displayCurrency = $scope.$root.store.load("displayCurrency") || "";
        $scope.$root.$watch('displayCurrency', function (a,b) {
            if (a && a != b) {
                $scope.$root.store.save("displayCurrency", $scope.$root.displayCurrency);
            }
        });
        
        var currencies = $scope.$root.store.load("currencies") || [],
            changes = $scope.$root.store.load("changes") || [],
            expenses = $scope.$root.store.load("expenses") || [];
        
        currencies.forEach(function (currency) {
            $scope.$root.currencyList.add(currency.name, currency.symbol);
        });
        changes.forEach(function (change) {
            $scope.$root.changeList.add(change.from, change.to, change.rate);
        });
        expenses.forEach(function (expense) {
            var newExpense = new Expense(expense.name, expense.price, expense.currencyName, expense.quantity);
            if (expense.archivedAt) {
                newExpense.archivedAt = expense.archivedAt;
            }
            $scope.$root.expenseList.add(newExpense);
        });
        
        [['currencyList', 'currencies'], ['changeList', 'changes'], ['expenseList', 'expenses']].forEach(function (list) {
            var listName = list[0],
                arrayName = list[1];
            $scope.$root.$watch(listName, function (a,b){
                if (a && a != b) {
                    $scope.$root.store.save(arrayName, $scope.$root[listName][arrayName]);
                }
            }, true);
        });
        
    }
    loadFromStore();
    setTimeout(function(){
        if ($scope.$root.currencyList.currencies.length == 0) {
            $scope.$root.currencyList.add("EUR", "€ ");
            $scope.$root.currencyList.add("YEN", "¥ ");
        }
        if ($scope.$root.changeList.changes.length == 0) {
            $scope.$root.changeList.add("EUR", "YEN", 125);
        }
    }, 1);
    
    
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
function ArchivesCtrl($scope, $filter, expenseRenderer, totals) {
    $scope.$root.currentMenuItem = "#/archives";
    $scope.expenseRenderer = function (price, expense) {
        return expenseRenderer(price, expense, $scope.$root.changeList, $scope.$root.currencyList.toHash(), $scope.$root.displayCurrency);
    };   
    $scope.unarchiveExpense = function (expense) {
        delete (expense.archivedAt);
    };
    $scope.destroyExpense = function (i) {
        $scope.$root.expenseList.destroy(i);
    };
    $scope.totals = function() {
        return totals("archivedAt", $scope.$root.expenseList, $scope.$root.changeList, $scope.$root.displayCurrency, $scope.$root.currencyList.toHash());
    };
}
function ExpensesCtrl($scope, expenseRenderer, totals) {
    $scope.$root.currentMenuItem = "#/expenses";
//    $scope.newExpense = new Expense("", "", $scope.$root.displayCurrency, 1);
    $scope.expenseRenderer = function (price, expense) {
        return expenseRenderer(price, expense, $scope.$root.changeList, $scope.$root.currencyList.toHash(), $scope.$root.displayCurrency);
    };
    $scope.addExpense = function () {
        if ($scope.editMode) {
            $scope.clearNewExpense();
            return true;
        }
        if ($scope.newExpense.name && $scope.newExpense.quantity && $scope.newExpense.price && $scope.newExpense.currencyName) {
            $scope.$root.expenseList.add($scope.newExpense);
            $scope.clearNewExpense();            
        }
    };
    $scope.clearNewExpense = function () {
        $scope.newExpense = new Expense("", "", $scope.$root.displayCurrency, 1);
        $scope.editMode = false;
    }
    $scope.clearNewExpense();
    $scope.editExpense = function (expense) {
        $scope.newExpense = expense;
        $scope.editMode = true;
        document.querySelector("input[type=\"text\"]").focus();
    }
    $scope.archiveExpense = function (expense) {
        expense.archivedAt = new Date();
        $scope.clearNewExpense();
    };

    $scope.totals = function() {
        return totals("!archivedAt", $scope.$root.expenseList, $scope.$root.changeList, $scope.$root.displayCurrency, $scope.$root.currencyList.toHash());
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
    $scope.addExpense = function () {
        if ($scope.newExpense.name && $scope.newExpense.quantity && $scope.newExpense.price && $scope.newExpense.currencyName) {
            $scope.newExpense.archivedAt = new Date();
            $scope.$root.expenseList.add($scope.newExpense);
            $scope.clearNewExpense();            
        }
    };
    $scope.clearNewExpense = function () {
        $scope.newExpense = new Expense("", "", $scope.$root.displayCurrency, 1);
    };
    $scope.clearNewExpense();
}

