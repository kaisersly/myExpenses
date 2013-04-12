//var test = new TestJs("document");
var test = {
    assert: function () {},
    clear: function () {},
    stop: function () {}
};

var Change = function (from, to, rate) {
    var Change = {
        from: from,
        to: to,
        rate: rate,
        direction: "from"
    }
    Change.convert = function (value, direction) {
        var convertedValue;
        direction = direction || this.direction;
        if (direction === "to") {
            convertedValue = value / this.rate;
        } else {
            convertedValue = value * this.rate;
        }
        return convertedValue;
    };
    Change.copy = function () {
        return Object.create(Change);
    };
    return Change;
}

var change = new Change("EUR", "YEN", 120);
test.assert(change.from, "EUR", "from: EUR");
test.assert(change.to, "YEN", "to: YEN");
test.assert(change.rate, 120, "rate: 120");

test.assert(change.convert(1), 120, "convert 1 EUR to 120 YEN");
test.assert(change.convert(1, "from"), 120, "convert 1 EUR to 120 YEN");
test.assert(change.convert(120, "to"), 1, "convert 120 YEN to 1 EUR");
change.direction = "to";
test.assert(change.convert(120), 1, "convert 120 YEN to 1 EUR");



var ChangeList = function (changes) {
    var ChangeList = {};
    if (changes) {
        ChangeList.changes = changes;
    } else {
        ChangeList.changes = [];
    }
    ChangeList.find = function (from, to, copy) {
        if (copy === undefined) {
            copy = true;
        }
        var changeToReturn;
        ChangeList.changes.forEach(function (change){
            if (change.from === from && change.to === to) {
                changeToReturn = copy ? change.copy() : change;
            } else if (change.from === to && change.to === from) {
                if (copy) {
                    changeToReturn = change.copy();
                    changeToReturn.direction = "to";
                } else {
                    changeToReturn = change;
                }
            }
        });
        return changeToReturn;
    };
    ChangeList.findId = function (from, to) {
        var change = ChangeList.find(from, to, false);
        return ChangeList.changes.indexOf(change);
    };
//    Find and Update or Create
    ChangeList.add = function (from, to, rate) {
        var change = ChangeList.find(from, to, false);
        if (change) {
            if (change.from === from) {
                change.rate = rate;
            } else {
                change.rate = 1/rate;
            }
        } else {
            change = new Change(from, to, rate);
            ChangeList.changes.push(change);
        }
        return change;
    };
//    Convert one value with all known changes
    ChangeList.convert = function (value, from) {
        var values = [];
        ChangeList.changes.forEach(function(change) {
            if (change.from === from) {
                values.push([change.convert(value), change.to]);
            } else if (change.to === from) {
                values.push([change.convert(value, "to"), change.from]);
            }
        });
        return values;
    }
    ChangeList.destroy = function (from, to) {
        var id = ChangeList.findId(from, to);
        ChangeList.changes.splice(id, 1);
    }
    
    return ChangeList;
}
var changes = [
    new Change("EUR", "YEN", 120),
    new Change("EUR", "USD", 1.28)
]
var changeList = new ChangeList(changes);
test.assert(changeList.find("EUR", "YEN").convert(1), 120, "find EUR to YEN and change 1 EUR to 120 YEN" );
test.assert(changeList.find("YEN", "EUR").convert(120), 1, "find YEN to EUR and change 120 YEN to 1 EUR" );
test.assert(changeList.find("EUR", "USD").convert(10), 12.8, "find EUR to USD and change 10 EUR to 12.8 USD" );
test.assert(changeList.convert(1, "EUR")[0][0], 120, "mass convert 1 EUR to 120 YEN");
test.assert(changeList.convert(1, "EUR")[0][1], "YEN", "mass convert 1 EUR to 120 YEN");
test.assert(changeList.convert(1, "EUR")[1][0], 1.28, "mass convert 1 EUR to 1.28 USD");
test.assert(changeList.convert(1, "EUR")[1][1], "USD", "mass convert 1 EUR to 1.28 USD");

changeList.destroy("EUR", "YEN");
test.assert(changeList.find("EUR", "YEN"), undefined, "EUR to YEN is deleted");
test.assert(changeList.add("EUR", "USD", 1.27).convert(1), 1.27, "update EUR to USD and convert 1 EUR to 1.27 USD");
test.assert(changeList.add("EUR", "YEN", 115).convert(1), 115, "create EUR to YEN and convert 1 EUR to 115 YEN");
test.assert(changeList.add("YEN", "EUR", 1/115).convert(1), 115, "update YEN to EUR and convert 1 EUR to 115 YEN");


var Currency = function (name, symbol) {
    var Currency = {
        name: name,
        symbol: symbol
    };
    
    return Currency;
}

var yen = new Currency("YEN", "Y");
test.assert(yen.name, "YEN", "name is YEN");
test.assert(yen.symbol, "Y", "symbol is Y");



var CurrencyList = function (currencies) {
    var CurrencyList = {};
    if (currencies) {
        CurrencyList.currencies = currencies;
    } else {
        CurrencyList.currencies = [];
    }
    CurrencyList.find = function (name) {
        var currency;
        CurrencyList.currencies.forEach(function (c) {
            if (c.name === name) {
                currency = c;
            }
        });
        return currency;
    };
//    Find and Update or Create
    CurrencyList.add = function (name, symbol) {
        var currency = CurrencyList.find(name);     
        if (currency) {
            currency.symbol = symbol;
        } else {
            currency = new Currency(name, symbol);
            CurrencyList.currencies.push(currency);
        }
        return currency;
    };
    CurrencyList.destroy = function (name) {
        CurrencyList.currencies.forEach(function (c, i) {
            if (c.name === name) {
                CurrencyList.currencies.splice(i, 1);
            }
        });
    }
    CurrencyList.toHash = function () {
        var hash = {};
        CurrencyList.currencies.forEach(function (currency) {
            hash[currency.name] = currency.symbol;
        });
        return hash;
    }
    
    return CurrencyList;
}

var currencies = [
    new Currency("EUR", "E")
];
var currencyList = new CurrencyList(currencies);
test.assert(currencyList.find("EUR").name, "EUR", "find EUR");
test.assert(currencyList.add("YEN", "Y").symbol, "Y", "create YEN");
test.assert(currencyList.add("EUR", "e").symbol, "e", "update EUR");
test.assert(currencyList.currencies.length, 2, "currencies has 2 items");
test.assert(currencyList.toHash()["YEN"], "Y", "currencies Hash['YEN'] is 'Y'");



function Expense (name, price, currencyName, quantity) {
    var Expense = {
        name: name,
        price: price,
        currencyName: currencyName,
        quantity: quantity
    };
    Expense.total = function () {
        return Expense.price * Expense.quantity;
    };
    Expense.convert = function (changeList, to, copy) {
        if (copy === undefined) {
            copy = true;
        }
        var expense = copy ? Object.create(Expense) : Expense;
        if (Expense.currencyName !== to) {
            var change = changeList.find(Expense.currencyName, to);
            if (change) {
                expense.price = change.convert(expense.price);
                expense.currencyName = change.direction === "from" ? change.to : change.from;
                expense.quantity = Expense.quantity;
                expense.total = function () {
                    return expense.price * expense.quantity;
                };
                expense.converted = true;
            }
        }
        return expense;
    };
    return Expense;
}

var changes = [
    new Change("EUR", "YEN", 100)
]
var changeList = new ChangeList(changes);
var expense = new Expense("hotel", 5000, "YEN", 2);
test.assert(expense.total(), 10000, "total is 10000");
test.assert(expense.convert(changeList, "YEN").price, 5000, "convert 5000 YEN to 5000 YEN");
test.assert(expense.convert(changeList, "EUR").price, 50, "convert 5000 YEN to 50 EUR");



function ExpenseList (expenses) {
    var ExpenseList = {};
    if (expenses) {
        ExpenseList.expenses = expenses;
    } else {
        ExpenseList.expenses = [];
    }
//    Create
    ExpenseList.add = function (expense) {
        ExpenseList.expenses.push(expense);
    };
    ExpenseList.destroy = function (i) {
        ExpenseList.expenses.splice(i,1);
    };
    
    return ExpenseList;
}