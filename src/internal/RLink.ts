/**
 * Helper to handle link and navigation
 */
export class RLink extends HTMLElement {
  /**
   * lifecycle hook
   */
  connectedCallback(): void {
    // All elements with the rlink tag will have cursor 'pointer'
    this.style.cursor = 'pointer';

    /**
     * Attach onClick event and send bubble event to top Router
     *
     * @TODO: handle case when there is already an event attached
     */
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
