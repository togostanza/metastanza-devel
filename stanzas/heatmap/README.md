# Heatmap

### Data Format

Heatmap stanza accepts data in **flat, one-dimensional array structure only**.

#### JSON Structure

```typescript
// ✓ Correct: flat array of objects
[
  { group: string, variable: string, value: number, url?: string },
  { group: string, variable: string, value: number, url?: string },
  ...
]
```

**Required fields:**

- Row identifier (e.g., `group`): Group identifier for the row
- Column identifier (e.g., `variable`): Variable identifier for the column
- Value field (e.g., `value`): Numeric value to display in the heatmap cell

**Optional fields:**

- URL field (e.g., `url`): URL to link when the cell is clicked

#### Important Constraints

⚠️ **The data must be a flat, one-dimensional array.** Each data point should be represented as a separate object in the array.

**✓ Valid structure:**

JSON:

```json
[
  { "group": "A", "variable": "v1", "value": 30 },
  { "group": "A", "variable": "v2", "value": 45 }
]
```

CSV:

```csv
group,variable,value
A,v1,30
A,v2,95
A,v3,22
A,v4,14
A,v5,59
...
```

TSV:

```tsv
group	variable	value
A	v1	30
A	v2	95
A	v3	22
A	v4	14
A	v5	59
...
```

**✗ Invalid structure (nested arrays not supported):**

```json
[
  ["A", "v1", 30],
  ["A", "v2", 45]
]
```

**✗ Invalid structure (grouped objects not supported):**

```json
{
  "A": [
    { "variable": "v1", "value": 30 },
    { "variable": "v2", "value": 45 }
  ]
}
```
