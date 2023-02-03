import {
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

import StanzaSuperClass from "../../lib/StanzaSuperClass";

export default class KeyValue extends StanzaSuperClass {
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
      const label = column.label
        ? column.label
        : this.params["format_key"]
        ? datum_label.charAt(0).toUpperCase() +
          datum_label.substring(1).replace(/_/g, " ")
        : datum_label;
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
