const { useState, useEffect, StrictMode, useMemo, useReducer } = React
const { Dropdown } = semanticUIReact
function tasksReducer(blocks, action) {
    switch (action.type) {
        case 'added': {
            return [...blocks, action.row]
        }
        case 'changed': {
            return [...blocks]
        }
        case 'deleted': {
            blocks.splice(action.iRow, 1)
            return [...blocks]
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
const ReactFltRow = ({ ii, dfilter, onDelRow }) => {
    const [cOperand, setOperand] = useState(dfilter.getBlock(ii).Operand)
    const [cType, setCType] = useState(dfilter.getBlock(ii).Type)
    const [cIds, setCIds] = useState(dfilter.getBlock(ii).Ids)
    const sourceIds = useMemo(() => {
        const lstSrc = []
        for (let jj = 0; jj < cIds.length; jj++) {
            const lSrc = getSourceIds.call(dfilter, jj, ii, cType, cIds)
            lstSrc.push(lSrc.map(src => { return { key: src.Id, text: src.Name, value: src.Id } }))
        }
        return lstSrc
    }, [ii, cOperand, cType, cIds])
    const srcType = useMemo(() => {
        const lstSrc = []
        for(let jj = 0; jj < mType.length; jj++) {
            const x = mType[jj]
            switch(cType) {
                case 14: if(20 == x.Id || 19 == x.Id) continue;   // Master goal
                break;
                case 20: if(14 == x.Id || 19 == x.Id) continue;   // Masterbudget
                break;
                case 19: if(14 == x.Id || 20 == x.Id) continue;   // Fibu/Cost center
                break;
            }
            lstSrc.push({ key: x.Id, text: x.Name, value: x.Id })
        }
        return lstSrc
    }, [cType])
    useEffect(() => {
        const row = dfilter.getBlock(ii)
        const evnt = () => {
            setOperand(row.Operand)
            setCType(row.Type)
            setCIds([...row.Ids])
        }
        dfilter.setEvent(ii, evnt)
    }, [cOperand, cType])
    useEffect(() => {
        switch (cType) {
            case 1:     // Land/Region
                dfilter.setDataSource(ii + 1)
                break;
        }
        //  return () => { }
    }, [cIds])
    const delRow = () => {
        onDelRow(ii)
    }
    const onChangeOperand = (ii, obj) => {
        const newOperand = obj.value
        if (cOperand != newOperand) {
            const row = dfilter.getBlock(ii)
            setOperand(newOperand)
            row.Operand = newOperand;
        }
    }
    const onChangeType = (ii, obj) => {
        const newType = obj.value
        if (cType != newType) {
            const row = dfilter.getBlock(ii)
            row.Type = newType
            setCType(newType)
            const newIds = getInitIds(newType);
            setCIds(newIds)
            row.Ids = newIds
            dfilter.setDSource(ii)
        }
    }
    const onChangeId = (ii, jj, obj) => {
        const newId = obj.value
        const oldId = cIds[jj]
        if (newId != oldId) {
            const row = dfilter.getBlock(ii)
            const initIds = getInitIds(cType);
            cIds[jj] = newId
            for (let kk = jj + 1; kk < cIds.length; kk++) {
                cIds[kk] = initIds[kk]
            }
            const newIds = [...cIds]
            setCIds(newIds)
            row.Ids = newIds
            if (1 == cType)
                dfilter.setNextIds(ii, (type) => {
                    if (1 == type) return true;
                    return false
                })
        }
    }
    const clssBtnDel = `btn btn-primary rounded-circle bi bi-trash-fill btn-del-crite-${ii} btn-del-crite`
    return (
        <div c-criterial={ii}>
            {ii < 1 ? (<Dropdown disabled value={cOperand} selection
                options={[{ key: mFilterBy.id, text: mFilterBy.Name, value: mFilterBy.Id }]} />) : (
                <Dropdown selection placeholder='Operand Control'
                    onChange={(e, oj) => onChangeOperand(ii, oj)}
                    options={Operands.map(x => { return { key: x.Id, text: x.Name, value: x.Id } })}
                    value={cOperand} />)}
            <Dropdown selection placeholder='Type Control'
                onChange={(e, oj) => onChangeType(ii, oj)}
                options={srcType}
                value={cType} />
            {Array.isArray(cIds) ? cIds.map((_id, jj) => {
                return <Dropdown value={_id} options={sourceIds[jj]}
                    key={'id-item-idx_' + jj} selection
                    onChange={(e, oj) => onChangeId(ii, jj, oj)} />
            }) : null}
            {0 < ii ? <button className={clssBtnDel} type="button"
                onClick={() => delRow()}></button> : null}
        </div>
    )
}
const ReactFilter = ({ dfilter }) => {
    const [blocks, dispatch] = useReducer(tasksReducer, dfilter.getBlocks());
    const onDelRow = (ii) => {
        dfilter.removeBlock(ii)
        dispatch({
            type: 'deleted',
            iRow: ii
        });
    }
    const addFilter = () => {
        const type = 0
        const isNewBlk = isNewBlock()
        let oprnd = isNewBlk ? Operands[1].Id : Operands[0].Id
        const criter = new Criterial(oprnd, type, getInitIds(type))
        dfilter.pushBlock(criter)

        dispatch({
            type: 'added',
            row: criter
        });
        function isNewBlock() {
            const lstRow = dfilter.getBlocks()
            if (lstRow.length < 1) return true
            if (type == 1) return true
            if (lstRow.length == 1) {
                if (type == 1) return true
                return false
            }
            return false
        }
    }
    const setFilter = () => {
        if (typeof dfilter.setFilter == 'function') dfilter.setFilter()
    }
    return (
        <section className="mb-3">
            <b className="ms-2 text-success">Filter <span className="opacity-25">(React CDN)</span>: </b>
            <div className="list-criterial pb-0">
                {blocks.map((row, ii) => <ReactFltRow
                    key={`r-${ii}_o${row.Operand}_t${row.Type}_i${row.Ids.join('_')}`}
                    ii={ii} dfilter={dfilter} onDelRow={onDelRow} />)}
            </div>
            <div className="list-button pt-1">
                <button type="button" className="btn btn-primary btn-sm me-2"
                    onClick={() => setFilter()}><i className="bi bi-search"></i> Filter</button>
                <button type="button" className="btn btn-secondary btn-sm me-2">
                    <i className="bi bi-arrow-repeat"></i> Reset</button>
                <button type="button" className="btn btn-primary btn-sm me-2"
                    onClick={() => addFilter()}><i className="bi bi-plus-circle"></i> Add</button>
                <button type="button" className="btn btn-primary btn-sm">
                    <i className="bi bi-download"></i> Save filter</button>
            </div>
        </section>
    )
}

ReactDOM.createRoot(document.getElementById('react-filter')).render(<StrictMode>
    <ReactFilter dfilter={window._mFlter} />
</StrictMode>);