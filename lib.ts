import { NodeTemplatePart } from './TemplatePart/NodeTemplatePart';

export function isNode(node: Node | NodeTemplatePart): node is Node {
  return !!node && 'nodeType' in node;
}

export function isElement(node: Node|NodeTemplatePart): node is Element {
  return isNode(node) && node.nodeType === Node.ELEMENT_NODE;
}

export function isTextNode(node: Node|NodeTemplatePart): node is Text {
  return isNode(node) && node.nodeType === Node.TEXT_NODE;
}

export function isNodeTemplatePart(node: Node | NodeTemplatePart): node is NodeTemplatePart {
  return node instanceof NodeTemplatePart;
}

export function isPreceeding(nodeA: Node, nodeB: Node): boolean {
  return (
    isNode(nodeA) &&
    isNode(nodeB) &&
    nodeA.compareDocumentPosition(nodeB) === Node.DOCUMENT_POSITION_PRECEDING
  );
}

export function* descendantNodes(root: Node): IterableIterator<Node> {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL);
  // this also skips the root element
  let currentNode = walker.nextNode();
  while (currentNode !== null) {
    yield currentNode;
    currentNode = walker.nextNode();
  }
}
