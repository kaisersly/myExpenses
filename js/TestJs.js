function TestJs (output, css) {
    function log(text) {
        window.console.log(text);
    };
    function error(text) {
        window.console.error(text);
    };
    function info(text) {
        window.console.info(text);
    };
    function clear() {
        window.console.clear();
    };
    var TestJs = {};
    var testConsole = {
        init: function () {
        },
        print: function (text) {
            log(text);
        },
        error: function (text) {
            error(text);
        },
        info: function (text) {
            info(text);
        },
        clear: function () {
            clear();
        }
    };
    var testDocument = {
        init: function () {
            var stylesheet = document.createElement("link");
            stylesheet.setAttribute("rel", "stylesheet");
            stylesheet.setAttribute("type", "text/css");
            var css_path = css || "TestJs/TestJs.css";
            stylesheet.setAttribute("href", css_path);
            document.getElementsByTagName("head")[0].appendChild(stylesheet);
            
            var ul = document.getElementById("tests");
            if (ul) {
                this.ul = ul;
            } else {
                this.ul = document.createElement("ul");
                this.ul.setAttribute("id", "tests");
                document.getElementsByTagName("body")[0].appendChild(this.ul);
            }
        },
        li: function (text, css_class) {
            var li = document.createElement("li");
            if (css_class) {
                li.setAttribute("class", css_class);
            }
            li.textContent = text;
            this.ul.appendChild(li);
        },
        print: function (text) {
            this.li(text);
        },
        error: function (text) {
            this.li(text, "error");
        },
        info: function (text) {
            this.li(text, "info");
        },
        clear: function () {
            this.ul.innerHTML = "";
        }   
    };
    var testNull = {
        print: function () {},
        error: function () {},
        info: function () {},
        clear: function () {}
    };
    switch (output) {
        case "console":
            TestJs.output = testConsole;
            break;
        case "document":
            TestJs.output = testDocument;
            break;
        default:
            TestJs.output = testConsole;
            break;
    }
    TestJs.output.init();
    TestJs.assert = function (assertion, value, text) {
        try {
            if (assertion === value) {
                TestJs.output.print(text + " : Success");
            } else {
                TestJs.output.error(text + " : Failure (" + assertion + ")");
            }        
        }
        catch (err) {
            TestJs.output.error(text + " : Failure (" + err + ")");
        }
    };
    TestJs.info = function (text) {
        TestJs.output.info(text);
    };
    TestJs.clear = function () {
        TestJs.output.clear();
    };
    TestJs.stop = function () {
        TestJs.output = testNull;
    };
    return TestJs;
};