import { NodeTemplatePart } from '../TemplatePart/NodeTemplatePart';

export class SetterDetachedError extends Error { }


export interface NodeValueSetter {
  parentNode: Node & ParentNode;
  previousSibling?: Node;
  nextSibling?: Node;
  fullyTemplatized: boolean;
  previousReplacementNodes: Node[]; // should be NodeList
  nodeTemplatePartList: (Node | NodeTemplatePart)[];
  detached: boolean;
}


function previousSiblingAndLastPreviousReplacementNodeShareParentWithThis(
  nodeValueSetter: NodeValueSetter
): boolean {
  return (
    isSibling(nodeValueSetter, nodeValueSetter.previousSibling) &&
    isSibling(
      nodeValueSetter,
      nodeValueSetter.previousReplacementNodes[nodeValueSetter.previousReplacementNodes.length - 1]
    )
  );
}

function nextSiblingAndFirstPreviousReplacementNodeAreSiblingsOfThis(
  nodeValueSetter: NodeValueSetter
): boolean {
  return (
    isSibling(nodeValueSetter, nodeValueSetter.nextSibling) &&
    isSibling(nodeValueSetter, nodeValueSetter.previousReplacementNodes[0])
  );
}

export function detached(nodeValueSetter: NodeValueSetter): boolean {
  return (
    !previousSiblingAndLastPreviousReplacementNodeShareParentWithThis(nodeValueSetter) &&
    !nextSiblingAndFirstPreviousReplacementNodeAreSiblingsOfThis(nodeValueSetter)
  );
}

function isSibling(nodeValueSetter: NodeValueSetter, node: Node): boolean {
  return node.parentNode === nodeValueSetter.parentNode;
}

export function reconcileSiblings(nodeValueSetter: NodeValueSetter): void {
  if (
    !isSibling(nodeValueSetter, nodeValueSetter.nextSibling) &&
    !isSibling(nodeValueSetter, nodeValueSetter.previousSibling)
  ) { // 6.i
    if (previousSiblingAndLastPreviousReplacementNodeShareParentWithThis(nodeValueSetter)) { // 6.i.a
      nodeValueSetter.nextSibling =
        nodeValueSetter
          .previousReplacementNodes[nodeValueSetter.previousReplacementNodes.length - 1]
          .nextSibling;
    } else if (nextSiblingAndFirstPreviousReplacementNodeAreSiblingsOfThis(nodeValueSetter))
      nodeValueSetter.previousSibling = nodeValueSetter.previousReplacementNodes[0].previousSibling; // 6.i.b
    else
      throw new SetterDetachedError('NodeValueSetter is detached');
  }
}

declare global {
  interface Window {
    NodeTemplatePart: typeof NodeTemplatePart;
  }
}
