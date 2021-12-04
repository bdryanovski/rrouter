import { expect } from '@open-wc/testing';
import { match } from '../src/internal/utils.js';

describe('Utils', () => {
  describe('Match', () => {
    let routes: any[];

    beforeEach(() => {
      routes = [
        { path: '/', component: 'Home' },
        { path: '/about', component: 'About' },
        { path: '/contact/:id', component: 'Contact' },
        { path: '/contact/:id/:name', component: 'Contact' },
      ];
    });

    it('should find root route without saying anything', () => {
      expect(match(routes, '')).to.include(routes[0]);
      expect(match(routes, '/')).to.include(routes[0]);
    });

    it('should find a url from a list', () => {
      expect(match(routes, '/')).to.include(routes[0]);
      expect(match(routes, '/about')).to.include(routes[1]);
    });

    it('should return 404 when it could not find route', () => {
      expect(match(routes, '/not-real-url').path).to.equal('/404');
    });

    it('should pass params from url and match them', () => {
      expect(match(routes, '/contact/123')).to.include({
        params: { id: '123' },
      });
      expect(match(routes, '/contact/123/bob')).to.include({
        params: { id: '123', name: 'bob' },
      });
    });
  });
});
