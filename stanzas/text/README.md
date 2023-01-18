# Text

A stanza for displaying text. It supports both plain text format and Markdown format.

## About `highlight_css_url` parameter

Specifies the theme for syntax highlighting of code snippets in markdown mode. 
This stanza uses [highlight.js](https://highlightjs.org/) internally, so you can specify any CSS URL as long as it conforms to highjight.js CSS theme format.

A lot of themes are available to preview here: [highlight.js demo](https://highlightjs.org/static/demo/). 

It may be easier to pick a fitting theme name, and then use the [highlight.js CDN](https://cdnjs.com/libraries/highlight.js) ( filter by Asset Type: "Styling", then copy the CSS file URL with the name of the theme you chose, and paste it into `highlight_css_url`)
