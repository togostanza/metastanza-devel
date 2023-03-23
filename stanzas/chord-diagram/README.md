# Chord diagram

## Data format

Expected JSON data format:

```json
{
    "nodes": [
        {
            "id": <node id>,
            ...
        },
        ...
    ],
    "links": [
        {
            "source": <source node id>,
            "target": <target node id>,
            ...
        },
        ...
    ]
}
```

## Chord diagram / circle layout graph mode switch

`Chord diagram` / `circle layout graph` modes are switched by toggling the `node-size-fixed` param.

In `Circle layout graph` mode the min and max width of the edges can be controlled by `edge-width-min` and `edge-width-max` respectfully.

In `Chord diagram` mode edge width min and max can not be controlled.
