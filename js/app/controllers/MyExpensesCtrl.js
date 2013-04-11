function MyExpensesCtrl ($scope, $route, Store) {
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