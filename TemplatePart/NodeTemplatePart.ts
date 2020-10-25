import { applyNodeTemplatePartList } from '../concepts/applyNodeTemplatePartList';
import { isTextNode, isNodeTemplatePart } from '../lib';
import { NodeValueSetter } from '../phantoms/NodeValueSetter';
import { TemplatePart } from './TemplatePart';

/**
 * ### 4.6 `NodeTemplatePart` Interface
 *
 * `NodeTemplatePart` interface has four additional attributes: `parentNode`, `previousSibling`, `nextSibling`, `replacementNodes`, and two methods: `replace` and `replaceHTML` in addition to the ones inherited from `TemplatePart`.
 *
 * ```
 * [NoInterfaceObject]
 * interface NodeTemplatePart : TemplatePart {
 *     readonly attribute ContainerNode parentNode;
 *     readonly attribute Node? previousSibling;
 *     readonly attribute Node? nextSibling;
 *     [NewObject] readonly NodeList replacementNodes;
 *     void replace((Node or DOMString)... nodes);
 *     void replaceHTML(DOMString html);
 * };
 * ```
 *
 */
export class NodeTemplatePart extends TemplatePart {
  nodeValueSetter: NodeValueSetter;

  replacementNodeList: Node[] = []; // should be NodeList

  constructor(
    expression: string,
    nodeValueSetter: NodeValueSetter,
  ) {
    super(expression);
    this.nodeValueSetter = nodeValueSetter;
    this.replacementNodeList = []; // should be NodeList
  }

  /**
   * The `parentNode` is a readonly IDL attribute, which on getting must return the parent node of the _node value setter_ associated with the context object.
   */
  get parentNode(): ParentNode & Node {
    return this.nodeValueSetter.parentNode;
  }

  /**
   * The `previousSibling` is a readonly IDL attribute on getting must run these steps:
   *
   * 1. Let *nodeValueSetter* be the _node value setter_ associated with the context object.
   * 2. Let *partList* be _node template part list_ of *nodeValueSetter*.
   * 3. If the context object is the first item in *partList*, return the previous sibling of *nodeValueSetter* and abort these steps.
   * 4. Let *previousPart* be an item in *partList* immediately before the context context.
   * 5. While *previousPart* is not null:
   *     1. If *previousPart* is a [`Text`](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node), return *previousPart* and abort these steps.
   *     2. Otherwise (*previousPart* is another _node template part_):
   *         1. If the _replacement nodes_ of *previousPart* is not empty, return the last node in the _replacement nodes_ and abort these steps.
   *     3. Let *previousPart* be the item immediately before *previousPart* in *partList*.
   * 6. Return null.
   */
  get previousSibling(): Node {
    /** ***********  STEP 1  ************ */
    /** ***********  STEP 2  ************ */
    const { nodeTemplatePartList } = this.nodeValueSetter;

    /** ***********  STEP 3  ************ */
    if (this === nodeTemplatePartList[0])
      return this.nodeValueSetter.previousSibling;

    /** ***********  STEP 4  ************ */
    let previousPart = nodeTemplatePartList[nodeTemplatePartList.indexOf(this) - 1];

    /** ***********  STEP 5  ************ */
    while (previousPart !== null) {
      if (isTextNode(previousPart))
        return previousPart;
      else if (isNodeTemplatePart(previousPart) && previousPart.replacementNodes.length > 0)
        return previousPart.replacementNodes[previousPart.replacementNodes.length - 1];

      previousPart = nodeTemplatePartList[nodeTemplatePartList.indexOf(previousPart) - 1];
    }

    /** ***********  STEP 6  ************ */
    return null;
  }

  /**
   * The `nextSibling` is a readonly IDL attribute on getting must run these steps:
   *
   * 1. Let *nodeValueSetter* be the _node value setter_ associated with the context object.
   * 2. Let *partList* be _node template part list_ of *nodeValueSetter*.
   * 3. If the context object is the last item in *partList*, return the next sibling of *nodeValueSetter* and abort these steps.
   * 4. Let *nextPart* be an item in *partList* immediately after the context context.
   * 5. While *nextPart* is not null:
   *     1. If *nextPart* is a [`Text`](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node), return *nextPart* and abort these steps.
   *     2. Otherwise (*nextPart* is another _node template part_):
   *         1. If the _replacement nodes_ of *nextPart* is not empty, return the first node in the _replacement nodes_ and abort these steps.
   *     3. Let *nextPart* be the item immediately after *nextPart* in *partList*.
   * 6. Return null.
   */
  get nextSibling(): Node {
    /** ***********  STEP 1  ************ */
    /** ***********  STEP 2  ************ */
    const { nodeTemplatePartList } = this.nodeValueSetter;

    /** ***********  STEP 3  ************ */
    if (this === nodeTemplatePartList[nodeTemplatePartList.length - 1])
      return this.nodeValueSetter.nextSibling;

    /** ***********  STEP 4  ************ */
    let nextPart = nodeTemplatePartList[nodeTemplatePartList.indexOf(this) + 1];

    /** ***********  STEP 5  ************ */
    while (nextPart !== null) {
      if (isTextNode(nextPart))
        return nextPart;
      else if (isNodeTemplatePart(nextPart) && nextPart.replacementNodes.length > 0)
        return nextPart.replacementNodes[nextPart.replacementNodes.length - 1];

      nextPart = nodeTemplatePartList[nodeTemplatePartList.indexOf(nextPart) + 1];
    }

    /** ***********  STEP 6  ************ */
    return null;
  }

  /**
   * The `replacementNodes` is a readonly IDL attribute, which on getting must return the _replacement nodes_ of the context object.
   */
  get replacementNodes(): Node[] {
    return this.replacementNodeList;
  }

  /**
   * The `value` IDL attribute of `TemplatePart` when involved on a _node template part_, on getting, must run these steps:
   *
   * 1. Let *value* be an empty string.
   * 2. For every *node* in the _replacement nodes_ of the context object:
   *     1. Append the result of invoking [textContent](https://dom.spec.whatwg.org/#dom-node-textcontent) to *value*.
   * 3. Return *value*.
   *
   * On setting, it must run these steps:
   *
   * 1. If the _replacement nodes_ consists of exactly one [`Text`](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node):
   *     1. Let *text* be the [`Text`](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node) in _replacement nodes._
   *     2. [Replace data](https://dom.spec.whatwg.org/#concept-cd-replace) with *text*, offset 0, count text's [length](https://dom.spec.whatwg.org/#concept-node-length), and data new value.
   * 2. Otherwise:
   *     1. Let *text* be a new [`Text`](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node) with its [data](https://dom.spec.whatwg.org/#concept-cd-data) set to new value and [node document](https://dom.spec.whatwg.org/#concept-node-document) set to *parentNode*'s associated [node document](https://dom.spec.whatwg.org/#concept-node-document).
   *     2. Remove all nodes from the _replacement nodes_, and insert *text*.
   * 3. Run the concept to _apply node template part list_ with the _node value setter_ associated with the context object.
   *
   */
  get value(): string {
    return [...this.replacementNodeList]
      .reduce((acc, { textContent }) =>
        `${acc}${textContent}`, '');
  }

  set value(newValue: string) {
    /** ***********  STEP 1  ************ */
    if (this.replacementNodeList.length === 1 && isTextNode(this.replacementNodeList[0])) {
      const [text] = this.replacementNodeList; // 1.i
      text.replaceData(0, text.length, newValue); // 1.ii
      // text.data = newValue; // 1.ii
      this.replacementNodeList = [text];
    /** ***********  STEP 2  ************ */
    } else {
      const text = this.parentNode.ownerDocument.createTextNode(newValue); // 2.i
      this.replacementNodeList = [text]; // 2.ii
    }

    /** ***********  STEP 3  ************ */
    applyNodeTemplatePartList(this.nodeValueSetter);
  }

  /**
   * The `replace(nodes)` method, when involved, must run these steps:
   *
   * 1. Replace each string in *nodes* with a new [`Text`](https://dom.spec.whatwg.org/#text) [node](https://dom.spec.whatwg.org/#concept-node) whose [data](https://dom.spec.whatwg.org/#concept-cd-data) is the string and [node document](https://dom.spec.whatwg.org/#concept-node-document) is document.
   * 2. If any node in *nodes* is a [`Document`](https://dom.spec.whatwg.org/#document), [`DocumentType`](https://dom.spec.whatwg.org/#documenttype), or [`DocumentFragment`](https://dom.spec.whatwg.org/#documentfragment) [node](https://dom.spec.whatwg.org/#concept-node), then [throw](https://heycam.github.io/webidl/#dfn-throw) an "[`InvalidNodeTypeError`](https://heycam.github.io/webidl/#invalidnodetypeerror)" [`DOMException`](https://heycam.github.io/webidl/#idl-DOMException).
   * 3. Remove all nodes from the _replacement nodes_, and insert *nodes*.
   * 4. Run the concept to _apply node template part_ list with the node value setter associated with the context object.
   */
  replace(...nodesOrStrings: (Text | string)[]): void {
    /** ***********  STEP 1  ************ */
    const nodes = nodesOrStrings.map(nodeOrString => {
      if (typeof nodeOrString === 'string')
        return document.createTextNode(nodeOrString);
      else
        return nodeOrString;
    });

    /** ***********  STEP 2  ************ */
    for (const node of nodes) {
      if (
        node instanceof Document ||
        node instanceof DocumentType ||
        node instanceof DocumentFragment
      )
        throw new DOMException('Invalid Node Type', 'InvalidNodeTypeError');
    }

    /** ***********  STEP 3  ************ */
    /** ***********  STEP 4  ************ */
    this.replaceNodes(nodes);
  }

  /**
   * The `replaceHTML(html)` method, when involved, must run these steps:
   *
   * 1. Let *fragment* be the result of invoking the [fragment parsing algorithm](https://w3c.github.io/DOM-Parsing/#dfn-fragment-parsing-algorithm) with *html* as markup, and the parent node of the _node value setter_ associated with the context object as the context element.
   * 2. Let nodes be *nodes* be [children](https://dom.spec.whatwg.org/#concept-tree-child) of *fragment*.
   * 3. Remove all nodes from the _replacement nodes_, and insert *nodes*.
   * 4. Run the concept to _apply node template part list_ with the node value setter associated with the context object.
   */
  replaceHTML(html: string): void {
    /** ***********  STEP 1  ************ */
    const fragment: Element = this.nodeValueSetter.parentNode.cloneNode() as Element;
    fragment.innerHTML = html;
    /** ***********  STEP 2  ************ */
    const nodes = Array.from(fragment.childNodes);

    /** ***********  STEP 3  ************ */
    /** ***********  STEP 4  ************ */
    this.replaceNodes(nodes);
  }

  private replaceNodes(nodes: Node[]): void {
    this.replacementNodeList = nodes;
    applyNodeTemplatePartList(this.nodeValueSetter);
  }
}
