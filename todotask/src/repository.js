export function getLsTaskType(SnfId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let ls = []
            ls.push({ Id: 1, Name: 'Backlog item', Icon: 'bi-diagram-2-fill' })
            ls.push({ Id: 2, Name: 'Implement', Icon: 'bi-bounding-box' })
            ls.push({ Id: 3, Name: 'Improvement', Icon: 'bi-bounding-box-circles' })
            ls.push({ Id: 4, Name: 'Bug', Icon: 'bi-bug-fill' })
            ls.push({ Id: 5, Name: 'Main goal', Icon: 'bi-circle-fill' })
            ls.push({ Id: 6, Name: 'Sub goal', Icon: 'bi-sign-dead-end-fill' })
            ls.push({ Id: 7, Name: 'Action', Icon: 'bi-box-fill' })
            ls.push({ Id: 8, Name: 'Epic', Icon: 'bi-heptagon-fill' })
            ls.push({ Id: 9, Name: 'Feature', Icon: 'bi-box-fill' })
            ls.push({ Id: 10, Name: 'User Story', Icon: 'bi-stop-fill' })
            ls.push({ Id: 11, Name: 'Task', Icon: 'bi-stop' })
            ls.push({ Id: 12, Name: 'Initiative', Icon: 'bi-fullscreen-exit' })
            ls.push({ Id: 13, Name: 'Strategische Ziele', Icon: 'bi-sign-dead-end' })
            ls.push({ Id: 14, Name: 'Aktionen', Icon: 'bi-box-fill' })
            ls.push({ Id: 15, Name: 'Thema', Icon: 'bi-folder-fill' })
            ls.push({ Id: 16, Name: 'Organisation', Icon: 'bi-building-fill' })
            resolve(ls);
        }, 559)
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