var myExpenses = angular.module("myExpenses", []);

function MyExpensesCtrl ($scope) {
    
}

function CurrenciesCtrl ($scope) {
    var currencies = [
        new Currency("EUR", "E"),
        new Currency("YEN", "Y"),
        new Currency("USD", "$")
    ];
    $scope.$root.currencyList = new CurrencyList(currencies);
}
function ChangesCtrl ($scope) {
    var changes = [
        new Change("EUR", "YEN", 120),
        new Change("EUR", "USD", 1.28)
    ];
    $scope.$root.changeList = new ChangeList(changes);
}
function ExpensesCtrl ($scope) {
    var expenses = [
        new Expense("Avion", 900, "EUR", 1),
        new Expense("Hotel", 5000, "YEN", 5)
    ];
    $scope.convertedExpense = [];
    $scope.convertToAll = function (expense, index) {
        $scope.convertedExpense[index] = $scope.$root.changeList.convert(expense.price, expense.currencyName);
    };
    $scope.$root.expenseList = new ExpenseList(expenses);
}
function ToolsCtrl ($scope) {
    $scope.$watch("value", function (a, b) {
        if (a !== undefined) {
            if ($scope.currencyName) {
                $scope.convertedValue = $scope.$root.changeList.convert($scope.value, $scope.currencyName);
            }
        }
    });
}