import { TemplateInstance } from '../../TemplateInstance/TemplateInstance';
import { TemplatePart } from '../../TemplatePart/TemplatePart';

export type TemplateProcessCallback =
  <T extends unknown>(
    instance: TemplateInstance,
    parts: TemplatePart[],
    state: T
  ) => void;

export interface TemplateTypeInit {
  processCallback: TemplateProcessCallback;
  createCallback?: TemplateProcessCallback;
}

/**
 */
export function defineTemplateType(
  this: Document,
  type: string,
  typeInit: TemplateTypeInit,
): void {
  templateTypes.set(type, typeInit);
}

const DEFAULT_TEMPLATE_TYPE_INIT: TemplateTypeInit = {
  processCallback<T extends unknown>(
    instance: TemplateInstance,
    parts: TemplatePart[],
    state: T
  ) {
    if (!state) return;
    for (const part of parts) {
      if (part.expression in state)
        part.value = state[part.expression];
    }
  },
};

export const templateTypes =
  new Map<string, TemplateTypeInit>();

export function getTemplateInit(type: string): TemplateTypeInit {
  if (!type)
    return DEFAULT_TEMPLATE_TYPE_INIT;
  else
    return templateTypes.get(type) ?? DEFAULT_TEMPLATE_TYPE_INIT;
}

declare global {
  interface Document {
    defineTemplateType(type: string, typeInit: TemplateTypeInit): void;
  }
}
