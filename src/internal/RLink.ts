export class RLink extends HTMLElement {
  connectedCallback(): void {
    // All elements with the rlink tag will have cursor 'pointer'
    this.style.cursor = 'pointer';

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
