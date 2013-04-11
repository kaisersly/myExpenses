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