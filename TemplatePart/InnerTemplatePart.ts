import { NodeValueSetter } from '../phantoms/NodeValueSetter';
import { NodeTemplatePart } from './NodeTemplatePart';

export class InnerTemplatePart extends NodeTemplatePart {
  get template(): HTMLTemplateElement {
    return this.nodeValueSetter.parentNode as HTMLTemplateElement;
  }

  get directive(): string {
    return this.template.getAttribute('directive');
  }

  constructor(template: HTMLTemplateElement, nodeValueSetter: NodeValueSetter) {
    super(template.expression, nodeValueSetter);
  }
}

declare global {
  interface Window {
    InnerTemplatePart: typeof InnerTemplatePart;
  }
}
