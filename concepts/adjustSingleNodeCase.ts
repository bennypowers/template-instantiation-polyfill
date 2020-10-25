import { TemplateInstance } from '../TemplateInstance/TemplateInstance';

/**
 * To **adjust single node case** with *node*, run these steps:
 *
 * 1. Let *parent* be the  [parent](https://dom.spec.whatwg.org/#concept-tree-parent) [node](https://dom.spec.whatwg.org/#concept-node) of *node.*
 * 2. If *parent* is an instance of `TemplateInstance` and *node* does not have any [sibling](https://dom.spec.whatwg.org/#concept-tree-sibling):
 *    1. Let *emptyText* be a new [`Text`](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node) with its [data](https://dom.spec.whatwg.org/#concept-cd-data) set to an empty string and [node document](https://dom.spec.whatwg.org/#concept-node-document) set to *currentNode*'s associated [node document](https://dom.spec.whatwg.org/#concept-node-document).
 *    2. [Insert](https://dom.spec.whatwg.org/#concept-node-insert) *emptyText* into *parent* before *node*.
 *
 * > Note: This algorithm is needed when there is exactly one template element surrounded by text nodes or a single `{{~}}` inside a template. In those cases, we need some node to anchor _node value setter_ other than text node / template element itself.
 */
export function adjustSingleNodeCase(node: Node): void {
  const parent = node.parentNode;
  if (
    parent instanceof TemplateInstance &&
    !node.previousSibling &&
    !node.nextSibling
  ) {
    const emptyText = node.ownerDocument.createTextNode('');
    parent.insertBefore(emptyText, node);
  }
}
