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