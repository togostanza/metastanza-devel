# Histogram

A MetaStanza that renders a histogram from numeric values.

## Parameters
- data-url (required)
- data-type (json|tsv|csv|sparql-results-json)
- axis-x-key (required)
- data-bin-count (default: 20)
- axis-x-*, axis-y-* (title default: "count")
- tooltip (optional)
- event-incoming_change_selected_nodes / event-outgoing_change_selected_nodes

## Notes
- axis-y-key is not required; Y values are computed as bin counts.
- Selecting a bin toggles selection for all items inside the bin and emits changeSelectedNodes.
