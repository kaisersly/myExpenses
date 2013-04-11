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