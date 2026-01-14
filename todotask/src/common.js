export function buildTree(arrNode) {
    let nTree = new Map()
    for (const node of arrNode) { nTree.set(node.Id, node) }
    for (const [id, node] of nTree) { node.children = new Set(arrNode.filter(x => id == x.ParentId)) }
    for (const [id, node] of nTree) {
        let paId = node.ParentId
        if (paId) node.parent = nTree.get(paId)
        else node.parent = null
    }
    for (const [id, node] of nTree) {
        delete node.ParentId;
    }
    return nTree;
}