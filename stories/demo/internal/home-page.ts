import { html, LitElement } from 'lit';

export class DemoHome extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    console.log('Home page is loaded');
  }

  render() {
    return html`<h1>Home</h1>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-home': DemoHome;
  }
}

window.customElements.define('demo-home', DemoHome);
