import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// stanzasディレクトリ内の各stanzaディレクトリを取得
function getStanzaDirectories() {
  const stanzasDir = path.join(__dirname, "stanzas");
  return fs
    .readdirSync(stanzasDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// metadata.jsonからstanza:keyを抽出
function extractKeysFromMetadata(stanzaName) {
  const metadataPath = path.join(
    __dirname,
    "stanzas",
    stanzaName,
    "metadata.json"
  );

  if (!fs.existsSync(metadataPath)) {
    console.warn(`metadata.json not found for stanza: ${stanzaName}`);
    return [];
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    const keys = [];

    // stanza:parameterからキーを抽出
    if (metadata["stanza:parameter"]) {
      metadata["stanza:parameter"].forEach((param) => {
        if (param["stanza:key"]) {
          keys.push(param["stanza:key"]);
        }
      });
    }

    // stanza:styleからキーを抽出
    if (metadata["stanza:style"]) {
      metadata["stanza:style"].forEach((style) => {
        if (style["stanza:key"]) {
          keys.push(style["stanza:key"]);
        }
      });
    }

    return keys;
  } catch (error) {
    console.error(
      `Error reading metadata.json for ${stanzaName}:`,
      error.message
    );
    return [];
  }
}

// CSV形式で出力
function generateCSV() {
  const stanzaNames = getStanzaDirectories();
  const stanzaKeysMap = new Map();
  const allKeys = new Set();

  // 各stanzaのキーを収集
  stanzaNames.forEach((stanzaName) => {
    const keys = extractKeysFromMetadata(stanzaName);
    stanzaKeysMap.set(stanzaName, new Set(keys));
    keys.forEach((key) => allKeys.add(key));
  });

  // キーをソート（--togostanzaで始まるものは最後に）
  const sortedKeys = Array.from(allKeys).sort((a, b) => {
    const aIsTogostanza = a.startsWith("--togostanza");
    const bIsTogostanza = b.startsWith("--togostanza");

    // 両方とも--togostanzaで始まる場合、または両方とも始まらない場合は通常のソート
    if (aIsTogostanza === bIsTogostanza) {
      return a.localeCompare(b);
    }

    // --togostanzaで始まるものを後に
    return aIsTogostanza ? 1 : -1;
  });

  // stanzaを指定された順番でソート
  const desiredOrder = [
    "barchart",
    "linechart",
    "scatter-plot",
    "heatmap",
    "piechart",
    "key-value",
    "pagination-table",
    "scroll-table",
    "column-tree",
    "ontology-browser",
    "sunburst",
    "tree",
    "treemap",
    "chord-diagram",
    "force-graph",
    "layered-graph",
    "scorecard",
    "text",
    "breadcrumbs",
    "venn-diagram",
    "named-map",
  ];

  const sortedStanzas = stanzaNames.sort((a, b) => {
    const aIndex = desiredOrder.indexOf(a);
    const bIndex = desiredOrder.indexOf(b);

    // 両方とも指定された順番にある場合
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // aのみ指定された順番にある場合
    if (aIndex !== -1) {
      return -1;
    }

    // bのみ指定された順番にある場合
    if (bIndex !== -1) {
      return 1;
    }

    // 両方とも指定された順番にない場合はアルファベット順
    return a.localeCompare(b);
  });

  // CSVヘッダー作成
  let csv = "Key," + sortedStanzas.join(",") + "\n";

  // 各キーの行を作成
  sortedKeys.forEach((key) => {
    let row = `"${key}"`;
    sortedStanzas.forEach((stanzaName) => {
      const hasKey = stanzaKeysMap.get(stanzaName).has(key);
      row += "," + (hasKey ? "○" : "");
    });
    csv += row + "\n";
  });

  return csv;
}

// メイン実行
function main() {
  try {
    console.log("Extracting stanza keys...");
    const csvContent = generateCSV();

    // CSVファイルに保存
    const outputPath = path.join(__dirname, "stanza_keys_matrix.csv");
    fs.writeFileSync(outputPath, csvContent, "utf8");

    console.log(`CSV file generated: ${outputPath}`);
    console.log("\nPreview:");
    console.log(csvContent.split("\n").slice(0, 10).join("\n") + "...");
  } catch (error) {
    console.error("Error generating CSV:", error.message);
  }
}

// スクリプトが直接実行された場合のみmainを実行
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { getStanzaDirectories, extractKeysFromMetadata, generateCSV };
