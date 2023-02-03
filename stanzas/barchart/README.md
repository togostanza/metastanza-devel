# Barchart

### Legend

With legend on, you can hide/show data lines by clicking the correspondong legend item.

### JSON/sparql-results-json data format

In square brackets there are stanza params to be mapped to these data keys:

```js
[
  {
    [axis-x-key]:  "Evidence at protein level",
    [axis-y-key]: "1859",
    [error_bars-key]: [98.5, 102.3],
    <... other optional data>
  },
  ...
]
```

For example,

```json
[
  {
  "category": "Evidence at protein level",
  "category_order": 0,
  "chromosome": "1",
  "chromosome_order": 0,
  "count": "1859",
  "error": ["1850", "1865"]
  },
  ...
]

```

### CSV/TSV data format

```csv
[axis-x-key],[axis-y-key],[error_bars-key]_q1,[error_bars-key]_q3,<other optional data>
Evidence at protein level,0,1,0,1859,1487.2,1896.18, <other optional data>
```

For example:

```csv
chromosome,count,error_q1,error_q3,<other optional data>
Evidence at protein level,0,1,0,1859,1487.2,1896.18, <other optional data>
```

### Expected data types

`axis-x-key`,`axis-y-key` are expecting String or Number

`error_bars-key` is expecting array with two elements, Strings or Numbers: [minValue, maxValue]

### Grouping

If `grouping-key` is not present in the data, the data will be treated as one big group.

#### Stacked

If the data grouping key is not present, all bars with the same `axis-x-key` would owerwrite previous one, resulting in showing bars only for the last datum with given `axis-x-key`.

#### Grouped

If the data grouping key is not present, grouping will result in showing add data with same `axis-x-key` on top of each other, with default color.
