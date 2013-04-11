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