/* istanbul ignore file */
import { LitElement } from 'lit-element';
import { State } from 'haunted';

export default class LitHauntedElement extends LitElement {
  constructor() {
    super();

    this.hauntedState = new State(() => this.requestUpdate(), this);
  }

  update(changedProperties) {
    this.hauntedState.run(() => super.update(changedProperties));
    this.hauntedState.runEffects();
  }
}
