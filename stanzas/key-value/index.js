import {
  downloadCSVMenuItem,
  downloadJSONMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

import MetaStanza from "../../lib/MetaStanza";

export default class KeyValue extends MetaStanza {
  menu() {
    return [
      downloadJSONMenuItem(this, "hashtable", this._data),
      downloadCSVMenuItem(this, "hashtable", this._data),
      downloadTSVMenuItem(this, "hashtable", this._data),
    ];
  }

  async renderNext() {
    const dataset = this._data[0];
    const columns = this.params.columns
      ? JSON.parse(this.params.columns)
      : Object.keys(dataset).map((key) => {
          return { id: key };
        });
    const values = columns.map((column) => {
      const datum_label = Object.keys(dataset).find((datum) => {
        return datum === column.id;
      });
      const label = column.label ? column.label : datum_label;
      const href = column.link ? dataset[column.link] : null;
      return {
        label,
        value: dataset[column.id],
        href,
        unescape: column.escape === false,
      };
    });
    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        values,
      },
    });
  }
}
