export function getLsTaskType(SnfId) {
    return new Promise((resolve) => {
        let ls = []
        ls.push({ Id: 1, Name: 'Backlog item', Icon: 'bi bi-diagram-2-fill' })
        ls.push({ Id: 2, Name: 'Implement', Icon: 'bi bi-bounding-box' })
        ls.push({ Id: 3, Name: 'Improvement', Icon: 'bi bi-bounding-box-circles' })
        ls.push({ Id: 4, Name: 'Bug', Icon: 'bi bi-bug-fill' })
        ls.push({ Id: 5, Name: 'Main goal', Icon: 'msic-Ellipse' })
        ls.push({ Id: 6, Name: 'Sub goal', Icon: 'msic-Rectangle-1' })
        ls.push({ Id: 7, Name: 'Action', Icon: 'msic-Rectangle-2' })
        ls.push({ Id: 8, Name: 'Epic', Icon: 'msic-Epic' })
        ls.push({ Id: 9, Name: 'Feature', Icon: 'msic-Feature' })
        ls.push({ Id: 10, Name: 'User Story', Icon: 'msic-User-Story' })
        ls.push({ Id: 11, Name: 'Task', Icon: 'msic-Rectangle-3' })
        ls.push({ Id: 12, Name: 'Initiative', Icon: 'msic-Initiative' })
        ls.push({ Id: 13, Name: 'Strategische Ziele', Icon: 'msic-Rectangle-4' })
        ls.push({ Id: 14, Name: 'Aktionen', Icon: 'msic-Rectangle-3' })
        ls.push({ Id: 15, Name: 'Thema', Icon: 'msic-Thema' })
        ls.push({ Id: 16, Name: 'Organisation', Icon: 'msic-Organisation' })
        resolve(ls);
    })
}
export function getLsNode(SnfId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let ls = []
            ls.push({
                Id: `${SnfId.generate()}`,
                TypeId: 1,
                Name: 'Project Alpha'
            })
            resolve(ls);
        }, 559)
    })
}