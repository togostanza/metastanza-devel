### Data format

#### json

In case of `data-type` "json", expects data in "long" format, i.e. every data point has it's own element in array:

```json
[
    {
        "foo": 1,
        "bar": 2,
        "baz": "Hoge hoge"
    },
    {
        "foo": 2,
        "bar": 3,
        "baz": "Fuga fuga"
    },
    ...
]

```

#### CSV / TSV

In case of `data-type` "csv" or "tsv", expects title row to contain the "keys", and each next row to contain values, i.e. (csv):

```csv
"foo","bar","baz"
1,2,"Hoge hoge"
2,3,"Fuga fuga"
...

```
