import { html, TemplateResult } from 'lit';
import '../src/r-router.js';
import '../src/r-link.js';
import '../src/r-outlet.js';

// Internal pages
import './demo/internal/application.js';
import './demo/internal/about-page.js';
import './demo/internal/home-page.js';
import './demo/internal/not-found.js';

export default {
  title: 'RRouter',
  component: 'r-router',
  argTypes: {
    basePath: { control: 'text' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = ({
  slot = html`<h1>Slotted content inside router</h1>`,
}: ArgTypes) => html`
  <demo-application>
    <nav class="nav">
      <ul>
        <li><r-link route="/">Home</r-link></li>
        <li><r-link route="/about/">About</r-link></li>
        <li><r-link route="/about/232">About but with arguments</r-link></li>
        <li><r-link route="/misc">Not Found page</r-link></li>
      </ul>
    </nav>

    <r-outlet></r-outlet>
    ${slot}
  </demo-application>
`;

export const Regular = Template.bind({});

// export const CustomTitle = Template.bind({});
// CustomTitle.args = {
//   title: 'My title',
// };

// export const CustomCounter = Template.bind({});
// CustomCounter.args = {
//   counter: 123456,
// };

// export const SlottedContent = Template.bind({});
// SlottedContent.args = {
//   slot: html`<p>Slotted content</p>`,
// };
// SlottedContent.argTypes = {
//   slot: { table: { disable: true } },
// };
