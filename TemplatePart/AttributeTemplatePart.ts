import { applyAttributeTemplatePartList } from '../concepts/applyAttributeTemplatePartList';
import { AttributeValueSetter } from '../phantoms/AttributeValueSetter';
import { TemplatePart } from './TemplatePart';

/**
 *
 * ### 4.5 `AttributeTemplatePart` Interface
 *
 * `AttributeTemplatePart` interface has four IDL attributes: `element`, `attributeName`, `attributeNamespace`, and `booleanValue` in addition the ones inherited from `TemplatePart`.
 */
export class AttributeTemplatePart extends TemplatePart {
  attributeValueSetter: AttributeValueSetter;

  /**
   * The `element` readonly IDL attribute, on getting, must return the associated [element](https://dom.spec.whatwg.org/#concept-attribute-element) of the _attribute value setter_ associated with the context object.
   */
  get element(): Element {
    return this.attributeValueSetter.element;
  }

  /**
   * The `attributeName` readonly IDL attribute, on getting, must return the [qualified name](https://dom.spec.whatwg.org/#concept-attribute-qualified-name) of the _attribute value setter_ associated with the context object..
   */
  get attributeName(): string {
    return this.attributeValueSetter.attr.name;
  }

  /**
   * The `attributeNamespace` readonly IDL attribute, on getting, must return the [namespace](https://dom.spec.whatwg.org/#concept-attribute-namespace) of the associated [attribute](https://dom.spec.whatwg.org/#concept-attribute) of the  _attribute value setter_ associated with the context object.
   */
  get attributeNamespace(): string {
    return this.attributeValueSetter.attr.namespaceURI;
  }

  #valueString: string;

  /**
   * The `value` IDL attribute of `TemplatePart` when involved on an _attribute template part_, on getting, must return the value string of the _attribute template part_ if the associated [attribute](https://dom.spec.whatwg.org/#concept-attribute) of the _attribute value setter_ associated with the context object if the attribute is _partially templatized_. Otherwise, if the [attribute](https://dom.spec.whatwg.org/#concept-attribute) is _fully templatized_, it must return its [attribute value](https://dom.spec.whatwg.org/#concept-attribute-value). On setting, it must set the value string of the _attribute template part_ to the new value, and _apply attribute template part list_ with the _attribute template part_ associated with the context object.
   */
  get value(): string {
    const { attr, fullyTemplatized } = this.attributeValueSetter;
    if (!fullyTemplatized)
      return this.#valueString;
    else
      return attr.value;
  }

  set value(newValue: string) {
    this.#valueString = newValue;
    applyAttributeTemplatePartList(this.attributeValueSetter);
  }

  /**
   * The `booleanValue` IDL attribute, on getting, must return `true` if the associated [element](https://dom.spec.whatwg.org/#concept-attribute-element) of the _attribute value setter_ associated with the context object has the associated [attribute](https://dom.spec.whatwg.org/#concept-attribute) of the _attribute value setter_ and return `false` otherwise. On setting, if the associated [attribute](https://dom.spec.whatwg.org/#concept-attribute) is _fully templatized_, it must set the string value to an empty string “”, and _apply attribute template part list_ with the _attribute template part_ associated with the context object. Otherwise, if the [attribute](https://dom.spec.whatwg.org/#concept-attribute) is _partially templatized_, it must throw a “[`NotSupportedError`](https://heycam.github.io/webidl/#notsupportederror)” [`DOMException`](https://heycam.github.io/webidl/#idl-DOMException).
   */
  get booleanValue(): boolean {
    return this.attributeValueSetter.element.hasAttribute(this.attributeValueSetter.attr.name);
  }

  set booleanValue(newValue: boolean) {
    if (this.attributeValueSetter.fullyTemplatized) {
      this.#valueString = '';
      applyAttributeTemplatePartList(this.attributeValueSetter);
    } else
      throw new DOMException('Value is not fully templatized', 'NotSupportedError');
  }

  constructor(value: string, setter: AttributeValueSetter) {
    super(value);
    this.attributeValueSetter = setter;
    this.#valueString = value;
  }
}

declare global {
  interface Window {
    AttributeTemplatePart: typeof AttributeTemplatePart;
  }
}
