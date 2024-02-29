# Views
Views are the server-rendered files that get displayed to the client-side browser.

# EJS
EJS is a templating languauge that allows building of HTML using JavaScript. Because it is HTML5 formatted, a normal HTML file can be changed to use the .ejs extension an work without needing to change anything else.

EJS allows data sent in from the server to be utilized with the HTML that is rendered on the client as soon as the page is loaded, without requiring any sort of DOM manipulation with scripting. This allows data from the database to immediately populate the client's view without having to wait on lengthy scripts to finish running.

## Partial Views
Partial files are an additional benefit to using EJS. For example, instead of writing the same header for every single view, a simple multi-use header.ejs file can be written once, and then every view that needs that header can just incorporate it with an `include` from EJS.