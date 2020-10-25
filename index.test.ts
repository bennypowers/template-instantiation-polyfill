import { expect } from '@open-wc/testing';

import './index';
import { TemplateInstance } from './TemplateInstance/TemplateInstance';

const template = document.createElement('template');
template.type = 'with-for-each';
template.directive = 'foo';
template.expression = 'bar';

const NESS_PNG = `data:image/png;base6f,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`;

const RNIWA_JPG = `data:image/jpeg;base64,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`;

// describe('Document#defineTemplateType', function() {
//   beforeEach(function() {
//     document.defineTemplateType('with-for-each', {
//       processCallback(instance, parts, state) {
//         for (const part of parts) {
//           const tokens = part.expression.split(' ');
//           const [first, propertyName] = tokens;
//           if (first === 'foreach') {
//             for (const item of state[propertyName]) {
//               // BUT how do we figure out how many parts are needed for: class, value, and label?
//             }
//           }
//         }
//       },
//     });
//   });
// });

describe('HTMLTemplateElement#createInstance', function() {
  let template: HTMLTemplateElement;
  let instance: TemplateInstance;

  describe('stamping a <template> with default template type', function() {
    before(function() {
      template = document.createElement('template');
      template.innerHTML = /* html */`
        <article>
          <h2>{{ name }}</h2>
          <img src="{{ picture }}" role="presentation"/>
          <p>{{ shortBio }}</p>
        </article>
      `;

      instance = template.createInstance({
        name: 'Benny',
        shortBio: 'gefilte ficcionado',
        picture: NESS_PNG,
      });

      document.body.appendChild(instance);
    });

    it('creates DOM structure', function() {
      expect(document.querySelectorAll('article').length).to.equal(1);
      expect(document.querySelectorAll('h2').length).to.equal(1);
      expect(document.querySelectorAll('img').length).to.equal(1);
      expect(document.querySelectorAll('p').length).to.equal(1);
    });

    it('imbues DOM with data', function() {
      expect(document.querySelector('img').src).to.equal(NESS_PNG);
      expect(document.querySelector('h2').textContent).to.equal('Benny');
      expect(document.querySelector('p').textContent).to.equal('gefilte ficcionado');
    });

    it('updates with new data', function() {
      instance.update({
        name: 'Ryosuke',
        shortBio: 'Platform Engineer at Apple',
        picture: RNIWA_JPG,
      });
      expect(document.querySelectorAll('article').length).to.equal(1);
      expect(document.querySelectorAll('h2').length).to.equal(1);
      expect(document.querySelectorAll('img').length).to.equal(1);
      expect(document.querySelectorAll('p').length).to.equal(1);

      expect(document.querySelector('img').src).to.equal(RNIWA_JPG);
      expect(document.querySelector('h2').textContent).to.equal('Ryosuke');
      expect(document.querySelector('p').textContent).to.equal('Platform Engineer at Apple');
    });
  });
});
