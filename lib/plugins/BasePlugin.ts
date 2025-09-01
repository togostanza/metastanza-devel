import MetaStanza from "../MetaStanza";

export interface BasePlugin {
  name: string;
  init?(stanza: MetaStanza): void;
}
