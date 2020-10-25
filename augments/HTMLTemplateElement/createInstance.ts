import { AttributeTemplatePart } from '../../TemplatePart/AttributeTemplatePart';
import { adjustSingleNodeCase } from '../../concepts/adjustSingleNodeCase';
import { applyAttributeTemplatePartList } from '../../concepts/applyAttributeTemplatePartList';
import { applyNodeTemplatePartList } from '../../concepts/applyNodeTemplatePartList';
import { parseATemplateString } from '../../concepts/parseATemplateString';
import { TemplateTokenType } from '../../enums';
import { descendantNodes, isElement, isTextNode } from '../../lib';
import { AttributeValueSetter } from '../../phantoms/AttributeValueSetter';
import { NodeValueSetter } from '../../phantoms/NodeValueSetter';
import { TemplateInstance } from '../../TemplateInstance/TemplateInstance';
import { getTemplateInit } from '../Document/defineTemplateType';
import { InnerTemplatePart } from '../../TemplatePart/InnerTemplatePart';
import { NodeTemplatePart } from '../../TemplatePart/NodeTemplatePart';
import { determineFullTemplatizablity } from '../../concepts/determineFullTemplatizablity';

/**
 * ### 4.3 Creating Template Parts
 *
 * The  `createInstance(optional any state)` method on `HTMLTemplateElement`, when invoked, must run the following steps:
 *
 * 1. Let *clonedTree* be the result of [cloning](https://dom.spec.whatwg.org/#concept-node-clone) with [the ](https://dom.spec.whatwg.org/#concept-node-clone)[template contents](https://html.spec.whatwg.org/multipage/scripting.html#template-contents) and the *clone children flag* set.
 * 2. Let *instance* be an instance of `TemplateInstance`.
 * 3. [Append](https://dom.spec.whatwg.org/#concept-node-append) *clonedTree* to *instance*.
 * 4. Let *parts* be an empty list.
 * 5. For every [descendent](https://dom.spec.whatwg.org/#concept-tree-descendant) node *currentNode* of *instance* in [tree order](https://dom.spec.whatwg.org/#concept-tree-order), run these steps:
 *     1. If *currentNode* is a [template element](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element):
 *         1. Run the concept to _adjust single node case_ with *currentNode*.
 *         2. Let *nodeValueSetter* be a new instance of the _node value setter_ with *currentNode*, the [previous sibling](https://dom.spec.whatwg.org/#concept-tree-next-sibling) of *currentNode*, the [next sibling](https://dom.spec.whatwg.org/#concept-tree-next-sibling) of *currentNode*, an empty _previous replacement nodes_, fully templatized set to the result of running the concept to _determine full templatizability_ with *currentNode*, and an empty _node template part list_.
 *         3. Let *innerPart* be a new instance of `InnerTemplatePart` associated with *currentNode*, an empty _replacement node list_, and *nodeValueSetter*.
 *         4. Append *innerPart* to the end of *parts.*
 *         5. [Remove](https://dom.spec.whatwg.org/#concept-node-remove) *currentNode* from the *currentNode*'s [parent](https://dom.spec.whatwg.org/#concept-tree-parent).
 *         6. Run the concept to _apply node template part list_ with *nodeValueSetter*.
 *     2. Otherwise, if *currentNode* is an [element](https://dom.spec.whatwg.org/#concept-element), for every [attribute](https://dom.spec.whatwg.org/#concept-attribute) in the [attribute list](https://dom.spec.whatwg.org/#concept-element-attribute) of *currentNode*:
 *         1. Let *value* be the [attribute value](https://dom.spec.whatwg.org/#concept-attribute-value) after [stripping leading and trailing ASCII whitespace](https://infra.spec.whatwg.org/#strip-leading-and-trailing-ascii-whitespace).
 *         2. Let *tokens* to be the result of running the concept to _parse a template string_ on *value*.
 *         3. If *tokens* contains exactly one string, abort the rest of steps and go to the next node.
 *         4. Let *attributeValueSetter* be a new instance of the _attribute value setter_ with *currentNode*, the current attribute, and an empty _attribute template part list_.
 *         5. For every *token* in *tokens*:
 *             1. If the type of *token* is “string”,
 *                 1. Append the string to end of the _attribute template part list_*.*
 *             2. Otherwise (if *token* is of the type “pair”),
 *                 1. Let *attributePart* be a new instance of `AttributeTemplatePart` with *attributeValueSetter* and null string.
 *                 2. Append *attributePart* to the end of the _attribute template part list_.
 *                 3. Append *attributePart* to the end of *parts*.
 *         6. Run the concept to _apply attribute template part list_ with *nodeValueSetter*.
 *     3. If *currentNode* is a [Text](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node):
 *         1. Let *value* be *currentNode*'s [data](https://dom.spec.whatwg.org/#concept-cd-data) after [stripping leading and trailing ASCII whitespace](https://infra.spec.whatwg.org/#strip-leading-and-trailing-ascii-whitespace).
 *         2. Let *tokens* to be the result of running the concept to _parse a template string_ on *value*.
 *         3. If *tokens* contains exactly one string, abort the rest of steps and go to the next node.
 *         4. Run the concept to _adjust single node case_ with *currentNode*.
 *         5. Let *nodeValueSetter* be a new instance of the _node value setter_ with the [parent](https://dom.spec.whatwg.org/#concept-tree-parent) [node](https://dom.spec.whatwg.org/#concept-node) of c*urrentNode*, the [previous sibling](https://dom.spec.whatwg.org/#concept-tree-next-sibling) of *currentNode*, an empty _previous replacement nodes_, fully templatized flag set to the result of running the concept to _determine full templatizability_ with *currentNode*, and an empty _node template part list_.
 *         6. For every *token* in *tokens*:
 *             1. If the type of *token* is “string”,
 *                 1. Let *text* be a new [Text](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node) with the string of the pair as the [data](https://dom.spec.whatwg.org/#concept-cd-data).
 *                 2. Append *text* to end of _node template part list_ of *nodeValueSetter*.
 *             2. Otherwise (if *token* is of the type “part”),
 *                1. Let *nodePart* be a new instance of `NodeTemplatePart` with *nodeValueSetter* and an empty _replacement node list_.
 *                2. Append *nodePart* to end of _node template part list_ of *nodeValueSetter*.
 *                3. Append *nodePart* to the end of *parts*.
 *        7. [Remove](https://dom.spec.whatwg.org/#concept-node-remove) *currentNode* from the *currentNode*'s [parent](https://dom.spec.whatwg.org/#concept-tree-parent).
 *        8. Run the concept to _apply node template part list_ with *nodeValueSetter*.
 * 6. Let *partArray* be be ! [ArrayCreate](https://tc39.github.io/ecma262/#sec-arraycreate)(0).
 * 7. Let *partsLength* be the result of performing [ArrayAccumulation](https://tc39.github.io/ecma262/#sec-runtime-semantics-arrayaccumulation) for *parts* with arguments *partsArray* and 0.
 * 8. If the previous step resulted in [abrupt completion](https://tc39.github.io/ecma262/#sec-completion-record-specification-type), return null.
 * 9. If there is a _template create callback_ associated with the context object:
 *     1. Let *createCallback* be `TemplateProcessCallback` associated with the context object.
 *     2. Invoke [[[Call]]](https://tc39.github.io/ecma262/#sec-ecmascript-function-objects-call-thisargument-argumentslist) internal method of *createCallback* with *instance*, *partArray*, and *state*.
 *     3. If the previous step resulted in [abrupt completion](https://tc39.github.io/ecma262/#sec-completion-record-specification-type), return null.
 * 10. Let *processCallback* be the template process callback associated with the context object.
 * 11. Invoke [[[Call]]](https://tc39.github.io/ecma262/#sec-ecmascript-function-objects-call-thisargument-argumentslist) internal method of *processCallback* with *instance*, *partArray*, and *state*.
 * 12. If the previous step resulted in [abrupt completion](https://tc39.github.io/ecma262/#sec-completion-record-specification-type), return null.
 * 13. Return *instance*.
 *
 * > Note: We run the concepts to _apply attribute template part list_ and _apply node template part list_ immediately to strip away the mustache syntax in the original template as well as whitespaces before & after it to keep the initial template state consistent with the one after running these concepts in a template process callback. Actual implementations can run these algorithm as it clones the tree, and avoid unnecessary churn of text nodes and strings as an optimization.
 */
export function createInstance<T extends unknown>(
  this: HTMLTemplateElement,
  state?: T,
): TemplateInstance {
  /** ***********  STEP 1  ************ */
  const clonedTree = this.content.cloneNode(true);

  /** ***********  STEP 2  ************ */
  const instance = new TemplateInstance(this.type);

  /** ***********  STEP 3  ************ */
  instance.append(clonedTree);

  /** ***********  STEP 5  ************ */
  const descendants = [...descendantNodes(instance)];

  for (const currentNode of descendants) {
    if (currentNode instanceof HTMLTemplateElement) { // 5.i
      adjustSingleNodeCase(currentNode); // 5.i.a
      const nodeValueSetter: NodeValueSetter = {
        parentNode: currentNode,
        previousSibling: currentNode.previousSibling,
        nextSibling: currentNode.nextSibling,
        previousReplacementNodes: [],
        fullyTemplatized: determineFullTemplatizablity(currentNode),
        nodeTemplatePartList: [],
        detached: false,
      };
      const innerPart = new InnerTemplatePart(currentNode, nodeValueSetter); // 5.i.c
      instance.parts.push(innerPart); // 5.i.d
      currentNode.parentNode.removeChild(currentNode); // 5.i.e
    } else if (isElement(currentNode)) { // 5.ii
      for (const attr of currentNode.attributes) {
        const value = attr.value.trim(); // 5.ii.a
        const tokens = parseATemplateString(value); // 5.ii.b
        if (tokens.length < 1 || tokens.length === 1 && tokens[0][0] === TemplateTokenType.string)
          continue; // 5.ii.c

        const attributeValueSetter: AttributeValueSetter = {
          element: currentNode,
          attr,
          attributeTemplatePartList: [],
        }; // 5.ii.d

        for (const [type, string] of tokens) { // 5.ii.e
          if (type === TemplateTokenType.string) // 5.ii.e.a
            attributeValueSetter.attributeTemplatePartList.push(string); // 5.ii.e.a.a
          else { // 5.ii.e.b
            const attributePart = new AttributeTemplatePart(string, attributeValueSetter);
            attributeValueSetter.attributeTemplatePartList.push(attributePart); // 5.ii.e.b.b
            instance.parts.push(attributePart); // 5.ii.e.b.c
          }
        }

        applyAttributeTemplatePartList(attributeValueSetter); // 5.ii.f
      }
    } else if (isTextNode(currentNode)) { // 5.iii
      const value = currentNode.data.trim(); // 5.iii.a
      const tokens = parseATemplateString(value); // 5.iii.b
      if (tokens.length < 1 || tokens.length === 1 && tokens[0][0] === TemplateTokenType.string)
        continue; // 5.iii.c

      adjustSingleNodeCase(currentNode); // 5.iii.d

      const nodeTemplatePartList: (Text | NodeTemplatePart)[] = [];

      const nodeValueSetter: NodeValueSetter = {
        parentNode: currentNode.parentNode === instance ? null : currentNode.parentNode,
        previousSibling: currentNode.previousSibling,
        nextSibling: currentNode.nextSibling,
        previousReplacementNodes: [],
        fullyTemplatized: determineFullTemplatizablity(currentNode),
        nodeTemplatePartList,
        detached: false,
      }; // 5.iii.e

      for (const [type, string] of tokens) { // 5.iii.f
        if (type === TemplateTokenType.string) { // 5.iii.f.a
          nodeTemplatePartList.push(new Text(string)); // 5.iii.f.a.b
        } else { // 5.iii.f.b
          const nodePart =
            new NodeTemplatePart(string, nodeValueSetter); // 5.iii.f.b.a
          nodeTemplatePartList.push(nodePart); // 5.iii.f.b.b
          instance.parts.push(nodePart); // 5.iii.f.b.c
        }
      }

      currentNode.remove(); // 5.iii.g

      applyNodeTemplatePartList(nodeValueSetter); // 5.iii.h
    }
  }

  /** ***********  STEP 6  ************ */
  const partArray = [...instance.parts];

  /** ***********  STEP 7  ************ */
  const partsLength = instance.parts.length; // Is this an ArrayAccumulation?

  /** ***********  STEP 8  ************ */
  if (partsLength === 0)
    return null;

  /** ***********  STEP 9  ************ */
  const { createCallback } = getTemplateInit(this.type);
  if (createCallback) {
    try {
      createCallback(instance, partArray, state);
    } catch {
      return null;
    }
  }

  try {
    /** ***********  STEP 10 ************ */
    const { processCallback } = getTemplateInit(this.type);

    /** ***********  STEP 11 ************ */
    processCallback(instance, partArray, state);
  } catch {
    /** ***********  STEP 12 ************ */
    return null;
  }

  /** ***********  STEP 13 ************ */
  return instance;
}

declare global {
  interface HTMLTemplateElement {
    createInstance<T extends unknown>(state?: T): TemplateInstance;

    type: string;
  }
}
