export class RLink extends HTMLElement {
  connectedCallback(): void {
    this.onclick = (e: Event) => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent('router:navigate', {
          bubbles: true,
          detail: {
            route: this.getAttribute('route'),
          },
        })
      );
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-link': RLink;
  }
}
