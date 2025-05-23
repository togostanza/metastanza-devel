import { noChange, nothing } from "lit";
import { AsyncDirective, directive } from "lit/async-directive.js";

const disconnectedRects = new Map();
class Flip extends AsyncDirective {
  constructor() {
    super();

    this.parent = undefined;
    this.element = undefined;
    this.boundingRect = undefined;
    this.id = undefined;
    this.role = "";
    this.parentRect = null;
  }

  render() {
    return nothing;
  }

  update(
    part,
    [
      {
        id = undefined,
        role = "",
        options = {},
        heroId = undefined,
        scrolledHeroRect = null,
      } = {},
    ]
  ) {
    this.id = id;
    this.role = role;
    this.heroId = heroId;

    this.scrolledHeroRect = scrolledHeroRect;

    // for column wich became hero, remove all other nodes from it
    // TODO not working for now (deleting nodes with animation)
    if (
      this.role === "hero" &&
      this.id !== this.heroId &&
      this.id !== "dummy"
    ) {
      disconnectedRects.set(this.id, part.getBoundingClientRect());
      this.remove();
    }

    // for new nodes in non-hero columns, slide them from 0 to their positions
    if (this.role !== "hero" && !disconnectedRects.has(this.id)) {
      disconnectedRects.set(this.id, { y: 0, x: 0, width: 0, height: 0 });
    }

    this.options = {
      ...this.options,
      ...options,
    };

    if (this.element !== part.element) {
      this.element = part.element;

      this.parent =
        this.element.parentElement ||
        this.element.getRootNode().querySelector(".column");
    }

    // memorize boundingRect before element updates
    if (this.boundingRect) {
      this.boundingRect = this.element.getBoundingClientRect();
    }
    // the timing on which LitElement batches its updates, to capture the "last" frame of our animation.
    Promise.resolve().then(() => this.prepareToFlip());
    return noChange;
  }

  prepareToFlip() {
    if (!this.boundingRect) {
      this.boundingRect = disconnectedRects.has(this.id)
        ? disconnectedRects.get(this.id)
        : this.element.getBoundingClientRect();
      disconnectedRects.delete(this.id);
    }

    this.flip();
  }

  flip(listener, removing) {
    let previous = this.boundingRect;

    if (this.id === this.heroId) {
      previous = this.scrolledHeroRect;
      this.boundingRect = this.element.parentElement.getBoundingClientRect();
    } else {
      this.boundingRect = this.element.getBoundingClientRect();
    }

    this.boundingRect = this.element.getBoundingClientRect();

    const deltaY = (previous?.y || 0) - (this.boundingRect?.y || 0);

    if (!deltaY && !removing) {
      return;
    }

    const filteredListener = (event) => {
      if (event.target === this.element) {
        listener(event);
        this.element.removeEventListener("transitionend", filteredListener);
      }
    };

    this.element.addEventListener("transitionend", filteredListener);

    this.element.animate(
      [
        {
          transform: `translate(0, ${deltaY}px)`,
        },
        {
          transform: `translate(0,0)`,
        },
      ],
      this.options
    );
  }

  remove() {
    this.element.animate(
      [
        {
          opacity: 1,

          transform: `translateY(0)`,
        },
        {
          opacity: 0,

          transform: `translateY(${
            this.element.getBoundingClientRect().y + 200
          }px)`,
        },
      ],
      this.options
    ).onfinish = () => {
      if (disconnectedRects.has(this.id)) {
        disconnectedRects.delete(this.id);
      }
      this.element.remove();
    };
  }

  disconnected() {
    if (this.role === "hero") {
      this.remove();
      return;
    }
    this.boundingRect = this.element.getBoundingClientRect();
    if (typeof this.id !== "undefined") {
      disconnectedRects.set(this.id, this.boundingRect);
      requestAnimationFrame(() => {
        if (disconnectedRects.has(this.id)) {
          this.remove();
        }
      });
    }
  }
}

export const flip = directive(Flip);
