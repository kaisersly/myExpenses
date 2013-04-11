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