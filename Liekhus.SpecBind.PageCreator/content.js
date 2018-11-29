function handleRequest(
    //The object data with the request params
    request,
    //These last two ones isn't important for this example, if you want know more about it visit: http://code.google.com/chrome/extensions/messaging.html
    sender, sendResponse
) {
    if (request.callFunction === "toggleSidebar")
        toggleSidebar();
}
chrome.extension.onRequest.addListener(handleRequest);

var sidebarOpen = false;
var selectorOptions = { prefix_tag: true };
var selectorGenerator = new CssSelectorGenerator(selectorOptions);
function toggleSidebar() {
    if (sidebarOpen) {

        var el = document.getElementById('pageSidebar');
        el.parentNode.removeChild(el);
        sidebarOpen = false;
        location.reload();
    }
    else {
        document.body.addEventListener('click', function (event) {
            var element = event.target;
            var selector = selectorGenerator.getSelector(element);

            if (isDescendant(document.getElementById('pageSidebar'), element) === false) { //not in our panel
                event.preventDefault();

                // get reference to the element user clicked on
                element.addEventListener('onclick', function (e) { e.preventDefault(); });
                element.addEventListener('click', function (e) { e.preventDefault(); });

                // do whatever you need to do with that selector
                var table = document.getElementById('elementsMapping');
                var row = table.insertRow(1);
                row.insertCell(0).innerHTML = "<input type='text' value='Element" + table.rows.length + "' onchange='generateCode();' />";
                row.insertCell(1).innerHTML = selector;

                var selections = document.querySelectorAll(selector);
                [].forEach.call(selections, function (selection) {
                    selection.classList.add('specbindHighlight');
                });

                generateCode();

                console.log('selector', selector);
            }
        });

        var sidebar = document.createElement('div');
        sidebar.id = "pageSidebar";
        var pageHtml = "";
        pageHtml = "<div class='specbindContainer' id='specbindContainer'>";
        pageHtml += "<h1>SpecBind Page Assistant</h1>";
        pageHtml += "<h2>by Patrick Liekhus</h2>";
        pageHtml += "<p>This utility allows you to select elements and get their CSS Selectors mapped.  While using the utility the elements will NOT perform their default behavior to keep you on this page.  To reset the behavior, when you close this utility your page will be refreshed and reset.</p>";
        pageHtml += "<table>";
        pageHtml += "<tr><td>Page Name</td><td><input id='pageName' value='Generated' /></td></tr>";
        pageHtml += "<tr><td>Page Path</td><td><span id='pagePath'>" + escape(window.location.pathname) + "</span></td></tr>";
        pageHtml += "<tr><td>Absolute Path</td><td><input type='checkbox' id='pageStaticPath' /></td></tr>";
        pageHtml += "</table > ";
        pageHtml += "<table id='elementsMapping'><tr><th>Friendly Name</th><th>CSS Selector</th></tr></table>";
        pageHtml += "<textarea name='specbindPageCode' id='specbindPageCode' cols='68' rows='15' readonly></textarea>";
        pageHtml += "</div>";

        sidebar.innerHTML = pageHtml;
        document.body.appendChild(sidebar);
        sidebarOpen = true;
    }
}

function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node !== null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function generateCode() {
    var code = document.getElementById("specbindPageCode");

    var generation = "[PageNavigation(\"" + escape(window.location.pathname) + "\")]\n";
    generation += "public class " + document.getElementById("pageName").value.replace(" ", "") + "Page \n";
    generation += "{\n";

    var table = document.getElementById("elementsMapping").rows;
    for (i = 1; i < table.length; i++)
    {
        console.log(table[i]);
        console.log(table[i].cells);
        generation += "\n";
        generation += "[ElementLocator(CssSelector = \"" + table[i].cells[1].innerText + "\")] \n";
        generation += "public IWebElement " + table[i].cells[0].getElementsByTagName('input')[0].value.replace(" ", "") + " { get; set; } \n";
    }
    generation += "}\n";

    code.innerText = generation;
}


