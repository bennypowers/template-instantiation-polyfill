import { AttributeValueSetter } from '../phantoms/AttributeValueSetter';
import { AttributeTemplatePart } from '../TemplatePart/AttributeTemplatePart';

/**
 * To **apply attribute template part list** with an _attribute value setter_ *attributeValueSetter*, run these steps:
 *
 * 1. Let *partList* be the *_attribute template part list_* of *attributeValueSetter*.
 * 2. If *partList* contains exactly one _attribute template part_ (this is the fully templatized case):
 *     1. Let *fullTemplate* be the _attribute template part_ in *tokenList*.
 *     2. If the value string of *fullTemplate* is null, [remove an attribute](https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace) with the namespace of the associated attribute of *attributeValueSetter*, the [local name](https://dom.spec.whatwg.org/#concept-attribute-local-name) of the associated attribute of *attributeValueSetter*, and the associated element of *attributeValueSetter.*
 *     3. Otherwise (if the value string of *fullTemplate* is not null), invoke [setAttributeNS](https://dom.spec.whatwg.org/#dom-element-setattributens) with the namespace of the associated attribute of *attributeValueSetter*, the [qualified name](https://dom.spec.whatwg.org/#concept-attribute-qualified-name) of the associated attribute of *attributeValueSetter*, and the value string of *attributeValueSetter* on the associated element of *attributeValueSetter.*
 * 3. Otherwise:
 *     1. Let *newValue* be an empty string.
 *     2. For each *part* in *partList*:
 *         1. If *part* is a “string”, append the string to the end of *newValue*.
 *         2. Otherwise (*part* is an _attribute template part_), append the value string of *part* to the end of *newValue*.
 *     3. Invoke [setAttributeNS](https://dom.spec.whatwg.org/#dom-element-setattributens) with the namespace of the associated attribute of *attributeValueSetter*, the [qualified name](https://dom.spec.whatwg.org/#concept-attribute-qualified-name) of the associated attribute of *attributeValueSetter*, and *newValue* on the associated element of *attributeValueSetter.*
 *
 * > Note: Only fully templatized attribute can be removed in the current proposal. An attribute template part never fails to update unlike a node template part which can fail to apply changes in some cases.
 */
export function applyAttributeTemplatePartList(setter: AttributeValueSetter): void {
  /** ***********  STEP 1  ************ */
  const { attr, element: currentNode, attributeTemplatePartList } = setter;

  const fullyTemplatized =
    attributeTemplatePartList.length === 1 && typeof attributeTemplatePartList[0] !== 'string';

  /** ***********  STEP 2  ************ */
  if (fullyTemplatized) { // fully templatized
    const [fullTemplate] = attributeTemplatePartList as [fullTemplate: AttributeTemplatePart];
    if (fullTemplate.value === null)
      currentNode.removeAttributeNS(attr.namespaceURI, attr.localName);
    else
      currentNode.setAttributeNS(attr.namespaceURI, attr.name, attr.value); // QUESTION: setter.value?
  } else {
  /** ***********  STEP 3  ************ */
    const newValue = attributeTemplatePartList.reduce<string>((acc, stringOrPart) =>
      `${acc}${typeof stringOrPart === 'string' ? stringOrPart : stringOrPart.value}`, '');
    currentNode.setAttributeNS(attr.namespaceURI, attr.name, newValue);
  }
}
