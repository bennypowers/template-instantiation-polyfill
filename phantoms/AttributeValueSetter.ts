import { AttributeTemplatePart } from '../TemplatePart/AttributeTemplatePart';

export interface AttributeValueSetter {
  element: Element
  attr: Attr;
  attributeTemplatePartList: (string|AttributeTemplatePart)[];
  fullyTemplatized?: boolean;
}
