import { isTextNode } from '../lib';
import { TemplateInstance } from '../TemplateInstance/TemplateInstance';

/**
 * To **determine full templatizability** of a node *node*, run these steps:
 *
 * 1. Let *parent* be *node*'s [parent](https://dom.spec.whatwg.org/#concept-tree-parent).
 * 2. If *parent* is an instance of `TemplateInstance`, return false.
 * 3. Let *child* be the [first child](https://dom.spec.whatwg.org/#concept-tree-first-child) of *parent*.
 * 4. While *child* is not null:
 *     1. If *child* is not *node:*
 *         1. If *child* is not [`Text`](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node), return false.
 *         2. If *child*'s [data](https://dom.spec.whatwg.org/#concept-cd-data) contains anything but [ASCII whitespace](https://infra.spec.whatwg.org/#split-on-ascii-whitespace), return false.
 *     2. Let *child* be the [next sibling](https://dom.spec.whatwg.org/#concept-tree-next-sibling) of *child*.
 * 5. Return true.
 *
 * > Note: This algorithm returns true when *node* is the sole child of its parent ignoring text nodes that only contain whitespace at the beginning and the end of the parent node.
 */
export function determineFullTemplatizablity(node: Node): boolean {
  if (!node)
    return false;

  /* *********** STEP 1 ************ */
  const parent = node.parentNode;

  /* ***********  STEP 2  ************ */
  if (parent instanceof TemplateInstance)
    return false;

  /* ***********  STEP 3  ************ */
  let child = parent?.firstChild;

  /* ***********  STEP 4  ************ */
  while (child !== null) {
    if (child !== node) { // 4.i
      if (!isTextNode(child)) // 4.i.a
        return false;
      if (child.data.trim().length) // 4.i.b
        return false;
    }

    child = child.nextSibling; // 4.ii
  }

  /* ***********  STEP 5  ************ */
  return true;
}
