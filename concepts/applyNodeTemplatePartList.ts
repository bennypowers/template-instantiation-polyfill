import { isNodeTemplatePart, isPreceeding, isTextNode } from '../lib';
import { NodeTemplatePart } from '../TemplatePart/NodeTemplatePart';
import { NodeValueSetter } from '../phantoms/NodeValueSetter';

/**
 * To **apply node template part list** with *nodeValueSetter***,** run these steps:
 *
 * 1. Let *partList* be the _node template part list_ of *nodeValueSetter*.
 * 2. Let *nodes* be an empty [node](https://dom.spec.whatwg.org/#concept-node) list.
 * 3. For every *part* in *partList*:
 *     1. If *part* is a [`Text`](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node), append *text* to *nodes*.
 *     2. Otherwise (*part* is a _node template part_), add every node in the _replacement nodes_ of *part* to *nodes*.
 * 4. Let *referenceNode* be null.
 * 5. If *nodeValueSetter*'s fully templatized flag is set:
 *     1. [Remove](https://dom.spec.whatwg.org/#concept-node-remove) all *parent*’s [children](https://dom.spec.whatwg.org/#concept-tree-child), in [tree order](https://dom.spec.whatwg.org/#concept-tree-order), with the *suppress observers flag* unset.
 * 6. Otherwise (*nodeValueSetter*'s _fully templatized flag_ is not set):
 *     1. If the [parent](https://dom.spec.whatwg.org/#concept-tree-parent) [nodes](https://dom.spec.whatwg.org/#concept-node) of the previous sibling and the next sibling associated with *nodeValueSetter* is different from the parent node associated with *nodeValueSetter*:
 *         1. If [parent](https://dom.spec.whatwg.org/#concept-tree-parent) [nodes](https://dom.spec.whatwg.org/#concept-node) of the previous sibling associated with *nodeValueSetter* and the last node in the _previous replacement nodes_ are same as the parent node associated with *nodeValueSetter*, set the next sibling of *nodeValueSetter* to the [next sibling](https://dom.spec.whatwg.org/#concept-tree-next-sibling) of the last node in the _previous replacement nodes_.
 *         2. If [parent](https://dom.spec.whatwg.org/#concept-tree-parent) [nodes](https://dom.spec.whatwg.org/#concept-node) of the next sibling associated with *nodeValueSetter* and the first node in the _previous replacement nodes_ are same as the parent node associated with *nodeValueSetter*, set the previous sibling of *nodeValueSetter* to the [previous sibling](https://dom.spec.whatwg.org/#concept-tree-previous-sibling) of the first node in the _previous replacement nodes_.
 *         3. Otherwise (if the above two conditions fail), abort these steps and return. The _node value setter_ is in a _detached state_.
 *     2. If the previous sibling associated with *nodeValueSetter* is a [preceding](https://dom.spec.whatwg.org/#concept-tree-preceding) node of the next sibling associated with *nodeValueSetter* in the parent node of *nodeValueSetter*, abort these steps and return. The _node value setter_ is in a _detached state_.
 *     3. Let *nodesToRemove* be an empty node list.
 *     4. Let *child* be the [next sibling](https://dom.spec.whatwg.org/#concept-tree-next-sibling) of the previous sibling of *nodeValueSetter.*
 *     5. While *child* is not the next sibling of *nodeValueSetter* (this could be null):
 *         1. Add *child* to *nodesToRemove*.
 *     6. Remove every node in *nodesToRemove* from the parent node of *nodeValueSetter*.
 *     7. Let *referenceNode* be the next sibling of *nodeValueSetter*.
 * 7. Let the _previous replacement nodes_ of *nodeValueSetter* be *nodes*.
 * 8. For every *node* in *nodes*:
 *     1. [Pre-insert](https://dom.spec.whatwg.org/#concept-node-pre-insert) *node* before *referenceNode*.
 *     2. Let *referenceNode* be *node*.
 *
 * > Note: This algorithm was devised to respond well to direct mutations made on a template instance as much as possible without having to add additional steps to [remove](https://dom.spec.whatwg.org/#concept-node-remove) a node like [ranges](https://dom.spec.whatwg.org/#concept-range). It allows insertion anywhere inside the parent node as well as removal of any node inserted by the _node value setter_ if the _node value setter_ is _fully templatized_. When the _node value setter_ is _partially templatized_, we only support inserting or removing nodes on one side as well as insertion or removal of nodes inserted by the _node value setter_ as long as it's the node next to the mutated side. If both the node before and the node after the insertion point were removed from the parent node, or if nodes were inserted before or after the insertion point and the node in the _previous replacement node_ on the same side is no longer in the parent, a _partially templatized_ _node value setter_ fails to apply its changes into the template instance. The _node value setter_ can recover from this state if these nodes are re-inserted back into the parent node.
 *
 * > Note: There is an alternative approach to use this algorithm once inside `createElement`, and have each node template part update itself independently. The benefit of that approach is that updating one node template part wouldn't re-insert nodes from other node template part. The drawback is that it would make the replacements less robust.
 */
export function applyNodeTemplatePartList(setter: NodeValueSetter): void {
  /** ***********  STEP 1  ************ */
  /** ***********  STEP 2  ************ */
  /** ***********  STEP 3  ************ */
  const nodes: Node[] = setter.nodeTemplatePartList.reduce((list, part) => [
    ...list,
    ...isTextNode(part) ? [part] : isNodeTemplatePart(part) ? part.replacementNodes : [],
  ], []);

  /** ***********  STEP 4  ************ */
  const referenceNode: Node = setter.nextSibling;

  if (setter.fullyTemplatized) {
  /** ***********  STEP 5  ************ */
    for (const child of setter.parentNode.childNodes)
      child.remove();
  } else {
  /** ***********  STEP 6  ************ */
    if (
      setter.parentNode &&
      setter.previousSibling?.parentNode !== setter.parentNode ||
      setter.nextSibling?.parentNode !== setter.parentNode ||
      (
        setter.previousSibling &&
        setter.nextSibling &&
        setter.previousSibling.parentNode !== setter.nextSibling.parentNode
      )
    ) {
      setter.detached = true;
      return;
    }

    if (isPreceeding(setter.previousSibling, setter.nextSibling)) {
      setter.detached = true;
      return; // 6.ii
    }

    const nodesToRemove = []; // 6.iii

    let child =
      setter.previousSibling?.nextSibling ??
      setter.parentNode?.firstChild; // 6.iv

    while (child !== setter.nextSibling) { // 6.v
      nodesToRemove.push(child); // 6.v.a
      child = child?.nextSibling;
    }

    // 6.vi
    for (const node of nodesToRemove)
      node.remove();
  }

  /** ***********  STEP 7  ************ */
  setter.previousReplacementNodes = nodes;

  /** ***********  STEP 8 ************ */
  const parentNode =
    setter.parentNode ??
    setter.previousSibling.parentNode;

  for (const node of nodes)
    parentNode?.insertBefore?.(node, referenceNode);

  // for (const node of nodes) {
  //   parentNode?.insertBefore?.(node, referenceNode);
  //   referenceNode = node;
  // }
}
