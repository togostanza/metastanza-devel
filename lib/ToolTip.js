import { LitElement, css, html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";

/**
 * ノードリスト内に特定のノードが存在するか確認するユーティリティ関数
 * @param {NodeList} nodeList - チェック対象のノードリスト
 * @param {Node} node - 存在確認するノード
 * @returns {boolean} nodeList に node が存在すれば true
 */
function isInNodeList(nodeList, node) {
  for (const nodeInList of nodeList.values()) {
    if (node === nodeInList) {
      return true;
    }
  }
  return false;
}

/**
 * ToolTip コンポーネント
 * LitElement を拡張して、ツールチップ表示の動作を実装
 */
export default class ToolTip extends LitElement {
  constructor() {
    super();

    // ツールチップ要素への参照
    this.tooltip = createRef();
    // 起点要素への参照（相対位置計算のため）
    this.origin = createRef();

    // ツールチップの対象となる複数のノードを保持する配列
    this.nodes = [];
    // ツールチップ表示状態のフラグ
    this.showing = false;
    // ツールチップに表示するテキストやHTMLコンテンツ
    this.tooltipContent = "";
    // ツールチップコンテンツをHTMLとして解釈するためのヘルパー関数
    this.tooltipHTML = (content) => html`${content}`;

    // マウスアウトイベント用のリスナー
    this.mouseEL = (e) => {
      // マウスが離れた先が、ツールチップ対象のノード内であればツールチップを表示
      if (isInNodeList(this.nodes, e.relatedTarget)) {
        // 起点要素の位置を取得
        const originRect = this.origin.value.getBoundingClientRect();
        const target = e.relatedTarget;
        // 対象要素の位置を取得
        const rect = target.getBoundingClientRect();
        // ツールチップ内容がHTMLかどうかの判定
        if (target.dataset.tooltipHtml === "true") {
          this.tooltipContent = this.tooltipHTML(target.dataset.tooltip);
        } else {
          this.tooltipContent = target.dataset.tooltip;
        }
        // ツールチップの表示位置を計算して設定
        this.tooltip.value.style.left =
          rect.x + rect.width * 0.5 - originRect.x + "px";
        this.tooltip.value.style.top = rect.y - originRect.y - 5 + "px";
        this.showing = true;
      } else {
        // ツールチップ対象からマウスが離れた場合は非表示にする
        this.showing = false;
      }
    };
  }

  /**
   * コンポーネントの内部状態として reactive なプロパティを定義
   */
  static get properties() {
    return {
      // ツールチップ対象のノードリスト
      nodes: { type: NodeList, state: true },
      // ツールチップに表示するコンテンツ
      tooltipContent: { type: String, state: true },
      // ツールチップの表示状態
      showing: { type: Boolean, state: true },
    };
  }

  /**
   * スタイル定義
   */
  static get styles() {
    return css`
      .origin {
        position: absolute;
        top: 0;
        left: 0;
      }
      .tooltip {
        padding: 2px 12px;
        position: absolute;
        z-index: 10000;
        background-color: white;
        filter: drop-shadow(0 0.5px 1px black);
        color: var(--togostanza-fonts-font_color);
        font-size: calc(var(--togostanza-fonts-font_size_secondary) * 1px);
        line-height: 1.5;
        transform: translate(-50%, -100%);
        border-radius: 10px;
        opacity: 0;
        height: 0;
        visibility: hidden;
        transition: height 0ms 250ms linear, opacity 200ms 0ms linear;
        pointer-events: none;
      }
      /* ツールチップの三角形（矢印）のスタイル */
      .tooltip::before {
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px 5px 0 4px;
        border-color: white transparent transparent transparent;
        display: block;
        position: absolute;
        left: 50%;
        bottom: -5px;
        transform: translateX(-50%);
      }
      /* ツールチップ表示時のスタイル */
      .tooltip.-show {
        opacity: 1;
        visibility: visible;
        height: 1.5em;
        transition: height 0ms 0ms linear, opacity 200ms 0ms linear, left 200ms,
          top 200ms;
      }
    `;
  }

  /**
   * レンダリング処理
   * origin と tooltip のDOM 要素を生成して、それぞれの参照をバインドする
   */
  render() {
    return html`
      <div class="origin" ${ref(this.origin)}></div>
      <div class="tooltip ${this.showing ? "-show" : ""}" ${ref(this.tooltip)}>
        ${this.tooltipContent}
      </div>
    `;
  }

  /**
   * コンポーネントが DOM から外れたときに発火
   * 親要素のイベントリスナーを削除してメモリリークを防止する
   */
  disconnectedCallback() {
    if (this.parentElement) {
      this.parentElement.removeEventListener("mouseout", this.mouseEL);
    }
    super.disconnectedCallback();
  }

  /**
   * 対象ノードの設定を行うメソッド
   * 親要素にマウスアウトのイベントリスナーを設定する
   * @param {NodeList | Array} nodes - ツールチップ対象となるノード一覧
   */
  setup(nodes) {
    this.nodes = nodes;
    this.parentElement.addEventListener("mouseout", this.mouseEL);
  }
}

// カスタム要素として登録
customElements.define("togostanza--tooltip", ToolTip);
