import ToolTip from "./ToolTip.js";
import Legend from "./Legend2.js";

/**
 * Options for handling API errors in the visualization.
 * @interface
 * @property {StanzaData} stanzaData - The data of the current stanza.
 * @property {() => void} drawContent - A function to draw the content of the stanza.
 * @property {boolean} [hasLegend] - Indicates whether the legend should be displayed.
 * @property {boolean} [hasTooltip] - Indicates whether tooltips should be displayed.
 * @property {LegendOptions} [legendOptions] - Configuration options for the legend.
 */
interface HandleApiErrorOptions {
  stanzaData: StanzaData;
  drawContent: () => void;
  hasLegend?: boolean;
  hasTooltip?: boolean;
  legendOptions?: LegendOptions;
}

/**
 * Represents the data needed to handle an API error.
 */
interface StanzaData {
  _main: HTMLElement;
  _apiError: boolean;
  root: ShadowRoot;
}

/**
 * Represents an item in the legend.
 */
export interface LegendItem {
  id: string | number;
  color: string;
  value: string | number;
  toggled?: boolean;
}

/**
 * Represents the configuration for the legend.
 */
interface LegendConfiguration {
  items: LegendItem[];
  title: string;
  options: Record<string, any>;
}

/**
 * Represents the options for displaying the legend.
 */
interface LegendOptions {
  isLegendVisible: boolean;
  legendConfiguration: LegendConfiguration;
}

/**
 * Handles API errors by displaying an error message or rendering the content.
 * Also manages legend and tooltip based on the configuration.
 */
export async function handleApiError(options: HandleApiErrorOptions) {
  const { stanzaData, drawContent, hasLegend, hasTooltip, legendOptions } =
    options;
  const { _main: main, _apiError: apiError, root } = stanzaData;
  const { isLegendVisible, legendConfiguration } = legendOptions ?? {};

  handleErrorMessage(apiError, main);
  if (!apiError) {
    await drawContent();
  }
  if (hasLegend) {
    manageLegend(isLegendVisible, legendConfiguration, root, apiError);
  }
  if (hasTooltip) {
    manageTooltip(main);
  }
}

/**
 * Displays or removes an error message based on the API error status.
 * @param apiError - Indicates if there is an API error.
 * @param main - The main HTML element to display the error message.
 */
function handleErrorMessage(apiError: boolean, main: HTMLElement) {
  const errorMessageEl = main.querySelector(".metastanza-error-message-div");

  if (apiError) {
    if (!errorMessageEl) {
      const errorMessageDiv = document.createElement("div");
      errorMessageDiv.className = "metastanza-error-message-div";
      errorMessageDiv.textContent = "Please fill in the exact data-url";
      main.appendChild(errorMessageDiv);
    }
  } else {
    errorMessageEl?.remove();
  }
}

/**
 * Manages the display of the legend based on the given parameters.
 * @param isShow - Determines whether the legend should be displayed.
 * @param config - The configuration for the legend.
 * @param root - The root HTML element where the legend will be displayed.
 * @param apiError - Indicates if there is an API error.
 */
function manageLegend(
  isShow: boolean,
  config: LegendConfiguration,
  root: ShadowRoot,
  apiError: boolean
) {
  const legendElement = root.querySelector("togostanza--legend2");
  if (!isShow || apiError) {
    legendElement?.remove();
  } else if (!legendElement) {
    const legend = new Legend();
    root.append(legend);
    legend.setup(config);
  }
}

/**
 * Manages the tooltip by removing any existing tooltip and creating a new one if necessary.
 * @param main - The main HTML element where the tooltip will be displayed.
 */
function manageTooltip(main: HTMLElement) {
  const tooltipElement = main.querySelector("togostanza--tooltip");
  tooltipElement?.remove();
  if (!tooltipElement) {
    const tooltip = new ToolTip();
    main.append(tooltip);
    tooltip.setup(main.querySelectorAll("[data-tooltip]"));
  }
}
