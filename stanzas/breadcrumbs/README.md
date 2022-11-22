# Breadcrumbs

You can copy the current path by clicking `copy_button` (enabled by setting `show_copy_button` to `true`)

## Data and parameters

### JSON/sparql-results-json data format

In square brackets there are stanza params to be mapped to these data keys, data keys without brackets must be present in the data:

```js
[
    {
      [node-key-id]:  1,
      [node-label_key]: "Transcript variant",
      parent: [node.id]
    },
    ...
]
```

For example,

```json
[
  {
    "id": 3,
    "value": "coding_sequence_variant",
    "label": "Coding sequence variant",
    "count": 18057,
    "description": "A sequence variant that changes the coding sequence",
    "parent": 2
    },
    ...
]

```

### CSV/TSV data format

```csv
[node-key-id],[node-label_key],parent,<other optional data>
3,Coding sequence variant,1,<other optional data>
```

For example:

```csv
id,label,parent,<other optional data>
3,Coding sequence variant,1,<other optional data>
```

### Expected data types

`[node-key-id]`,`[node-label-key]` are expecting String or Number

`parent` is expencted to be reference to `[node-key-id]` of some node, therefore, it should be the same type. if id is a String, `parent` value must be also a string.

> Note that `"parent"` key name should be present in the data

### Multiple root nodes

If multiple root nodes are found ( nodes with undefined `parent` ), a root node with id `root` will be created. In that case, one can specify its label by setting `root_node-label_text`.
`root_node-label_icon` can be used to show icon on the root node. Icon name is FontAwesome 5.0 icon name, in PascalCase, without any prefixes (`fa`, `fas` etc.) (example: "Home", "ArrowUp" etc. For available icon names please refer to FontAwesome [website](https://fontawesome.com/icons/magnifying-glass?s=solid&f=classic)

### Circular relations

Circular relations, i.e. if two nodes reference each other as a `parent` are not suppotred.

## Overflow menus

If you want to display nodes dropdown menus to overlap with other elements on your page, add

```css
.stanza-parent-element {
  overflow: visible;
}
```

to the stanza parent element CSS.
