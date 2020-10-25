import { getTemplateInit } from '../augments/Document/defineTemplateType';
import { TemplatePart } from '../TemplatePart/TemplatePart';

export class TemplateInstance extends DocumentFragment {
  parts: TemplatePart[] = [];

  #type: string;

  constructor(type: string) {
    super();
    this.#type = type;
  }

  /**
   * To update the associated attribute of an attribute value setter attributeValueSetter to an attribute, run these steps:
   *
   *    Remove the current associated attribute from the associated element.
   *    Change the associated attribute of attributeValueSetter to attribute.
   *    Run the concept to apply attribute template part list with attributeValueSetter.
   *
   *    Note: In the current proposal, updating attributeName or attributeNamespace would result in updating the attribute twice when changing both. We could instead make these IDL attributes readonly, and add a method which updates the associated attribute instead.
   *
   */
  update(state: unknown): void {
    getTemplateInit(this.#type)
      .processCallback(this, this.parts, state);
  }
}

declare global {
  interface Window {
    TemplateInstance: typeof TemplateInstance;
  }
}
