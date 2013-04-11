myExpenses.factory('expenseRenderer', function ($parse, $filter){  
    return function (expression, expense, changeList, currencyHash, to) {
        expense = expense.convert(changeList, to);
        var symbol = currencyHash[expense.currencyName];
        var text = $filter("currency")($parse(expression)(expense), symbol);
        return [text, expense.converted];
    }
});