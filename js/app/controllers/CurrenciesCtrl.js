function CurrenciesCtrl($scope) {
    $scope.$root.currentMenuItem = "#/currencies";
    
    $scope.addChange = function (change) {
        if ($scope.editChangeMode) {
            $scope.clearNewChange();
            return true;
        }
        change = change || $scope.newChange;
        $scope.$root.changeList.add(change.from, change.to, change.rate);
        if (change == $scope.newChange) {
            $scope.clearNewChange();
        }
    };
    $scope.clearNewChange = function () {
        $scope.newChange = {};
        $scope.editChangeMode = false;
    }
    $scope.editChange = function (change) {
        if (change == $scope.newChange) {
            $scope.clearNewChange();
            return true;
        }
        $scope.newChange = change;
        $scope.editChangeMode = true;
        document.querySelector("#newChange-rate").focus();
    }
    $scope.destroyChange = function (change) {
        $scope.$root.changeList.destroy(change.from, change.to);
    };    
    
    $scope.addCurrency = function (currency) {
        if ($scope.editCurrencyMode) {
            $scope.clearNewCurrency();
            return true;
        }
        currency = currency || $scope.newCurrency;
        $scope.$root.currencyList.add(currency.name, currency.symbol);
        if (currency == $scope.newCurrency) {
            $scope.clearNewCurrency();
        }
    };
    $scope.clearNewCurrency = function () {
        $scope.newCurrency = {};
        $scope.editCurrencyMode = false;
    }
    $scope.editCurrency = function (currency) {
        if (currency == $scope.newCurrency) {
            $scope.clearNewCurrency();
            return true;
        }
        $scope.newCurrency = currency;
        $scope.editCurrencyMode = true;
    }
    $scope.destroyCurrency = function (currency) {
        $scope.$root.currencyList.destroy(currency.name);
    };
}