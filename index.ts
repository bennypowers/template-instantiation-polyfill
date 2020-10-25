import { defineTemplateType } from './augments/Document/defineTemplateType';
import { createInstance } from './augments/HTMLTemplateElement/createInstance';
import { TemplateInstance } from './TemplateInstance/TemplateInstance';
import { AttributeTemplatePart } from './TemplatePart/AttributeTemplatePart';
import { InnerTemplatePart } from './TemplatePart/InnerTemplatePart';
import { NodeTemplatePart } from './TemplatePart/NodeTemplatePart';

HTMLTemplateElement.prototype.createInstance ??= createInstance;
Document.prototype.defineTemplateType ??= defineTemplateType;

['type', 'directive', 'expression'].forEach(property => {
  if (!Object.getOwnPropertyDescriptor(HTMLTemplateElement.prototype, property)) {
    Object.defineProperty(HTMLTemplateElement.prototype, property, {
      configurable: false,
      enumerable: true,
      get(this: HTMLTemplateElement) { return this.getAttribute(property); },
      set(this: HTMLTemplateElement, value: string) { this.setAttribute(property, value); },
    });
  }
});

declare global {
  interface HTMLTemplateElement {
    type: string;
    directive: string;
    expression: string;
  }
}

window.TemplateInstance ??= TemplateInstance;
window.AttributeTemplatePart ??= AttributeTemplatePart;
window.NodeTemplatePart ??= NodeTemplatePart;
window.InnerTemplatePart ??= InnerTemplatePart;
