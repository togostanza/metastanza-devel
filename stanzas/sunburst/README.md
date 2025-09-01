# Sunburst

### Showing nodes

In order to visualise the data, Sunburst stanza should receive:

1. Data with `data-url` as well as `data-type`.

The data should be hierarchy tree-like data of the format:

```json
[
  {
    "id": 1,
    "value": "some_value",
    "label": "Some label",
    "color": "#ff5733",
    "children": [2, 19, 25, 29, 30],
  },
  {
    "id": 2,
    "value": "some_value",
    "label": "Some another label",
    "color": "#33c4ff",
    "children": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    "parent": 1,
  },
  ...
]
```

`id`, `label` and `parent` keys are mandatory. `id` should be uniqe, positive integer number.

The tree nodes that does not have any children should contain number value
`"n": 12345` (where `12345` is a "size" of a node) as well.

### Node Colors

Individual node colors can be specified using the `node-color_key` parameter. If a node has a color property with a valid hex color value (e.g., "#ff5733"), that color will override the default group-based coloring.

The `node-color_blend` parameter allows you to control how custom colors blend with the background:

- `normal` (default): Standard color rendering
- `multiply`: Colors are multiplied with the background
- `screen`: Colors are screened with the background

### Copying current path

The path to current node can be copied in clipboard by right clicking in any point on this stanza and selecting `Copy path` context menu.

### Coupling with another stanza

Sunburst should share the same data that have been passed to another stanza.
Than could be done by using

```html
<togostanza--data-source
  url="{url to data}"
  receiver="name_of_first_stanza, name_of_second_stanza"
  target-attribute="data-url"
></togostanza--data-source>
```

To change currently showing hierarchy node, Sunburst stanza need to receive event `selectedDatumChanged` with

```
{details:{id: <id of the node to show>}}
```

as event payload.

Also, when clicking on the node inside the Sunburst stanza, will dispatch same `selectedDatumChanged` event with payload containing the `id` of clicked node in same manner.
