const { useState, useEffect, StrictMode } = React

const ReactFltRow = ({ ii, dfilter, onDelRow }) => {
    const [cOperand, setOperand] = useState(dfilter.getBlock(ii).Operand)
    const [cType, setCType] = useState(dfilter.getBlock(ii).Type)
    const [cIds, setCIds] = useState(dfilter.getBlock(ii).Ids)
    const destroyOperand = ($wrap) => {
        //const $wrap = $(`[c-criterial="${ii}"]`)
        let $input, control
        $input = $wrap.find(`[c-operand="${ii}"]`)
        control = $input.data("kendoDropDownList")
        if (control) control.destroy()
    }
    const destroyType = ($wrap) => {
        //const $wrap = $(`[c-criterial="${ii}"]`)
        let $input, control
        $input = $wrap.find(`[c-type="${ii}"]`)
        control = $input.data("kendoDropDownList")
        if (control) control.destroy()
    }
    const destroyIds = async ($wrap) => {
        //const $wrap = $(`[c-criterial="${ii}"]`)
        const lstTask = []
        for (let jj = cIds.length - 1; -1 < jj; jj--) {
            const task = new Promise(res => {
                const $input = $wrap.find(`[c-index="${jj}"]`)
                const control = $input.data("kendoDropDownList")
                if (control) control.destroy()
            })
            lstTask.push(task)
        }
        return await Promise.all(lstTask).then(() => {
            $wrap.find('.ccrite-grp-ids').empty();
        })
    }
    // useEffect(() => {
    //     const row = dfilter.getBlock(ii)
    //     const $wrap = $(`[c-criterial="${ii}"]`)
    //   //  const ctrlBackground = new TaskController({ priority: 'background' });
    //   //  let options = { signal: ctrlBackground.signal };
    //     const process = async () => {
    //       //  const task0 = scheduler.postTask(() => {
    //             dfilter.setEvent(ii, () => {
    //                 setOperand(row.Operand)
    //                 setCType(row.Type)
    //                 setCIds(row.Ids)
    //             })
    //       //  }, options);
    //        // await Promise.all([task0]);
    //     }
    //     process();
    //     renOperandControl()
    //     return () => {
    //         // console.log('before mount/update/unmount')
    //         destroyIds($wrap).then(() => {
    //             destroyType($wrap)
    //             destroyOperand($wrap)
    //             dfilter.removeEvent(ii)
    //         })
    //     }
    //     function renOperandControl() {
    //         const $operand = $wrap.find(`[c-operand="${ii}"]`)
    //         const operandChange = (e) => {
    //             const tOprnd = e.sender.value();
    //             row.Operand = parseInt(tOprnd);
    //             if (cOperand != row.Operand)
    //                 setOperand(row.Operand)
    //         }
    //         $operand.kendoDropDownList({
    //             dataTextField: "Name",
    //             dataValueField: "Id",
    //             dataSource: ii > 0 ? Operands : [mFilterBy],
    //             enable: ii < 1 ? false : true,
    //             value: cOperand,
    //             change: operandChange
    //         })
    //     }
    // }, [cOperand])
    // useEffect(() => {
    //     const row = dfilter.getBlock(ii)
    //     const $wrap = $(`[c-criterial="${ii}"]`)
    //   //  const ctrlBackground = new TaskController({ priority: 'background' });
    //  //   let options = { signal: ctrlBackground.signal };
    //     const process = async () => {
    //       //  const task0 = scheduler.postTask(() => {
    //             dfilter.setEvent(ii, () => {
    //                 setOperand(row.Operand)
    //                 setCType(row.Type)
    //                 setCIds(row.Ids)
    //             })
    //       //  }, options);
    //       //  await Promise.all([task0]);
    //     }
    //     process();
    //     renTypeControl()
    //     return () => {
    //         // console.log('before mount/update/unmount')
    //         destroyIds($wrap).then(() => {
    //             destroyType($wrap)
    //             dfilter.removeEvent(ii)
    //         })
    //     }
    //     function renTypeControl() {
    //         const $type = $wrap.find(`[c-type="${ii}"]`)
    //         const typeChange = (e) => {
    //             const tType = e.sender.value()
    //             row.Type = parseInt(tType)
    //             row.Ids = getInitIds(row.Type);
    //             const isChangeTyp = cType != row.Type
    //             if (isChangeTyp) setCType(row.Type)
    //             const isChangeId = cIds.join() != row.Ids.join()
    //             if (isChangeId) setCIds([...row.Ids])
    //             if (isChangeTyp || isChangeId)
    //                 dfilter.setDSource(ii)
    //         }
    //         $type.kendoDropDownList({
    //             dataTextField: "Name",
    //             dataValueField: "Id",
    //             dataSource: mType,
    //             value: cType,
    //             change: typeChange
    //         })
    //     }
    // }, [cType])
    // useEffect(() => {
    //     const row = dfilter.getBlock(ii)
    //     const $wrap = $(`[c-criterial="${ii}"]`)
    //   //  const ctrlBackground = new TaskController({ priority: 'background' });
    //   //  let options = { signal: ctrlBackground.signal };
    //     const process = async () => {
    //       //  const task0 = scheduler.postTask(() => {
    //             dfilter.setEvent(ii, () => {
    //                 setOperand(row.Operand)
    //                 setCType(row.Type)
    //                 setCIds([...row.Ids])
    //             })
    //       //  }, options);
    //       //  await Promise.all([task0]);
    //     }
    //     process();
    //     renderUiIds()
    //     renderIdsDropdownList()
    //     return () => {
    //         // console.log('before mount/update/unmount')
    //         destroyIds($wrap).then(() => {
    //             dfilter.removeEvent(ii)
    //         })
    //     }
    //     function renderUiIds() {
    //         $wrap.find('.ccrite-grp-ids').empty();
    //         let ui = ''
    //         for (let jj = 0; jj < cIds.length; jj++) {
    //             ui += `<input c-index="${jj}" style="width: 240px" />`
    //         }
    //         $wrap.find('.ccrite-grp-ids').append(ui)
    //     }
    //     async function renderIdsDropdownList() {
    //        // const lstTask = []
    //         for (let jj = 0; jj < row.Ids.length; jj++) {
    //             const _id = row.Ids[jj]
    //           //  const task = scheduler.postTask(() => {
    //                 const $input = $wrap.find(`[c-index="${jj}"]`)
    //                 const idChange = (e) => {
    //                     let id = e.sender.value()
    //                     id = parseInt(id);
    //                     if (row.Ids[jj] != id) {
    //                         row.Ids[jj] = id;
    //                         setCIds([...row.Ids])
    //                     }
    //                     dfilter.setDSource(ii)
    //                 }
    //                 $input.kendoDropDownList({
    //                     dataTextField: "Name",
    //                     dataValueField: "Id",
    //                     dataSource: getSourceIds(jj),
    //                     value: _id,
    //                     change: idChange
    //                 })
    //          //   }, options)
    //         //    lstTask.push(task)
    //         }
    //       //  await Promise.all(lstTask);
    //     }
    //     function getSourceIds(index) {
    //         let lst = []
    //         switch (cType) {
    //             case 1: // Land/Region
    //                 lst = [lType[0]]
    //                 if (0 == index) {
    //                     Lands.forEach(land => lst.push(land))
    //                     return lst
    //                 }
    //                 const landId = cIds[0]
    //                 return getRegions(landId, lst)
    //             case 2: // Product groups/Product
    //                 switch (index) {
    //                     case 0:     // Product group
    //                         lst = [lType[1]]
    //                         return getPrdGroups(lst)
    //                     case 1:     // product
    //                         const pgId = cIds[index - 1]
    //                         const lstPrdGrpId = pgId < 0 ? getPrdGroups([]).map(x => x.Id) : [pgId]
    //                         lst = [lType[2]]
    //                         return getProductsIn(lstPrdGrpId, lst)
    //                     case 2:     // sub product
    //                         const prdId = cIds[index - 1]
    //                         lst = [lType[3]]
    //                         return getSubProducts(prdId, lst)
    //                 }
    //                 return []
    //             case 3:
    //                 switch (index) {
    //                     case 0:     // stake holder group | sub market
    //                         lst = [lType[4]]
    //                         const mkIds = closestMarketIds()
    //                         return getSubmarket(mkIds, lst)
    //                     case 1: return [lType[5]]    // Contact person
    //                     case 2: return [lType[6]]    // Sub contact
    //                 }
    //                 return []
    //             case 5: // Market segments/Stakeholder groups
    //                 if (index == 0) {
    //                     lst = [lType[10], lType[0]]
    //                     const landRegnId = closestIds(ii, 1)
    //                     const landId = landRegnId.length ? landRegnId[0] : -1
    //                     return getMarkets(landId, lst)
    //                 }
    //                 const marketId = cIds[0]
    //                 lst = [lType[11]]
    //                 if (marketId < 0) return lst
    //                 for (let ii = 0; ii < StakeholderGroups.length; ii++) {
    //                     const stk = StakeholderGroups[ii]
    //                     if (0 < marketId && marketId != stk.MarketId) continue
    //                     lst.push(stk)
    //                 }
    //                 return lst
    //         }
    //         function getPrdGroups(lst) {
    //             const landRgnId = closestIds(ii, 1)
    //             const rgnIds = landRgnId.length > 1 ? [landRgnId[1]] : [0]
    //             return getProductGroups(rgnIds, lst)
    //         }
    //         function closestMarketIds() {
    //             for (let jj = ii - 1; -1 < jj; jj--) {
    //                 const prevCrite = dfilter.getBlock(jj)
    //                 if (1 == prevCrite.Type) {
    //                     const landId = prevCrite.Ids[0]
    //                     if (landId < 0) return []
    //                     if (landId == 0) {
    //                         const markets = getMarkets(0, [])
    //                         return markets.map(x => x.Id)
    //                     }
    //                     const markets = getMarkets(landId, [])
    //                     return markets.map(x => x.Id)
    //                 }
    //                 if (5 == prevCrite.Type) {
    //                     const mkrId = prevCrite.Ids[0]
    //                     const markets = getMarkets(mkrId, [])
    //                     return markets.map(x => x.Id)
    //                 }
    //             }
    //             return []
    //         }
    //         function closestIds(ii, type) {
    //             for (let jj = ii - 1; -1 < jj; jj--) {
    //                 const crite = dfilter.getBlock(jj)
    //                 if (crite.Type == type) return crite.Ids
    //             }
    //             return []
    //         }
    //     }
    // }, [cIds])
    useEffect(() => {
        const row = dfilter.getBlock(ii)
        const evnt = () => {
            setOperand(row.Operand)
            setCType(row.Type)
            setCIds([...row.Ids])
        }
        // console.log('mounted/updated')
        const $wrap = $(`[c-criterial="${ii}"]`)
      //  const ctrlBackground = new TaskController({ priority: 'background' });
      //  const ctrlUserBlock = new TaskController({ priority: 'user-blocking' });
      //  const ctrlUserVisble = new TaskController({ priority: 'user-visible' });
      //  let options = { signal: ctrlBackground.signal };
      //  let options2 = { signal: ctrlUserBlock.signal };
        const process = async () => {
          //  const task0 = scheduler.postTask(() => {
                dfilter.setEvent(ii, evnt)
          //  }, options);
          //  const task1 = scheduler.postTask(() => {
                renderUiIds()
                renOperandControl()
                renTypeControl()
                renderIdsDropdownList()
           // }, options2);
          //  await Promise.all([task0, task1]);
        }
        process()
        return () => {
            // console.log('before mount/update/unmount')
            let $input, control
            for (let jj = cIds.length - 1; -1 < jj; jj--) {
                $input = $wrap.find(`[c-index="${jj}"]`)
                control = $input.data("kendoDropDownList")
                if (control) control.destroy()
            }
            $input = $wrap.find(`[c-operand="${ii}"]`)
            control = $input.data("kendoDropDownList")
            if (control) control.destroy()
            $input = $wrap.find(`[c-type="${ii}"]`)
            control = $input.data("kendoDropDownList")
            if (control) control.destroy()
            $wrap.find('.ccrite-grp-ids').empty();
            dfilter.removeEvent(ii)
        }
        function renderUiIds() {
            $wrap.find('.ccrite-grp-ids').empty();
            let ui = ''
            for (let jj = 0; jj < cIds.length; jj++) {
                ui += `<input c-index="${jj}" style="width: 240px" />`
            }
            $wrap.find('.ccrite-grp-ids').append(ui)
        }
        function renOperandControl() {
            const $operand = $wrap.find(`[c-operand="${ii}"]`)
            const operandChange = (e) => {
                const tOprnd = e.sender.value();
                row.Operand = parseInt(tOprnd);
                if (cOperand != row.Operand)
                    setOperand(row.Operand)
            }
            $operand.kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "Id",
                dataSource: ii > 0 ? Operands : [mFilterBy],
                enable: ii < 1 ? false : true,
                value: cOperand,
                change: operandChange
            })
        }
        function renTypeControl() {
            const $type = $wrap.find(`[c-type="${ii}"]`)
            const typeChange = (e) => {
                const tType = e.sender.value()
                row.Type = parseInt(tType)
                row.Ids = getInitIds(row.Type);
                const isChangeTyp = cType != row.Type
                if (isChangeTyp) setCType(row.Type)
                const isChangeId = cIds.join() != row.Ids.join()
                if (isChangeId) setCIds([...row.Ids])
                if (isChangeTyp || isChangeId)
                    dfilter.setDSource(ii)
            }
            $type.kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "Id",
                dataSource: mType,
                value: cType,
                change: typeChange
            })
        }
        function renderIdsDropdownList() {
            for (let jj = 0; jj < row.Ids.length; jj++) {
                const _id = row.Ids[jj]
                const $input = $wrap.find(`[c-index="${jj}"]`)
                const idChange = (e) => {
                    let id = e.sender.value()
                    id = parseInt(id);
                    if(row.Ids[jj] != id) {
                        row.Ids[jj] = id;
                        setCIds([...row.Ids])
                    }
                    dfilter.setDSource(ii)
                }
                $input.kendoDropDownList({
                    dataTextField: "Name",
                    dataValueField: "Id",
                    dataSource: getSourceIds(jj),
                    value: _id,
                    change: idChange
                })
            }
        }
        function getSourceIds(index) {
            let lst = []
            switch (cType) {
                case 1: // Land/Region
                    lst = [lType[0]]
                    if (0 == index) {
                        Lands.forEach(land => lst.push(land))
                        return lst
                    }
                    const landId = cIds[0]
                    return getRegions(landId, lst)
                case 2: // Product groups/Product
                    switch (index) {
                        case 0:     // Product group
                            lst = [lType[1]]
                            return getPrdGroups(lst)
                        case 1:     // product
                            const pgId = cIds[index - 1]
                            const lstPrdGrpId = pgId < 0 ? getPrdGroups([]).map(x => x.Id) : [pgId]
                            lst = [lType[2]]
                            return getProductsIn(lstPrdGrpId, lst)
                        case 2:     // sub product
                            const prdId = cIds[index - 1]
                            lst = [lType[3]]
                            return getSubProducts(prdId, lst)
                    }
                    return []
                case 3:
                    switch (index) {
                        case 0:     // stake holder group | sub market
                            lst = [lType[4]]
                            const mkIds = closestMarketIds()
                            return getSubmarket(mkIds, lst)
                        case 1: return [lType[5]]    // Contact person
                        case 2: return [lType[6]]    // Sub contact
                    }
                    return []
                case 5: // Market segments/Stakeholder groups
                    if (index == 0) {
                        lst = [lType[10], lType[0]]
                        const landRegnId = closestIds(ii, 1)
                        const landId = landRegnId.length ? landRegnId[0] : -1
                        return getMarkets(landId, lst)
                    }
                    const marketId = cIds[0]
                    lst = [lType[11]]
                    if (marketId < 0) return lst
                    for (let ii = 0; ii < StakeholderGroups.length; ii++) {
                        const stk = StakeholderGroups[ii]
                        if (0 < marketId && marketId != stk.MarketId) continue
                        lst.push(stk)
                    }
                    return lst
            }
            function getPrdGroups(lst) {
                const landRgnId = closestIds(ii, 1)
                const rgnIds = landRgnId.length > 1 ? [landRgnId[1]] : [0]
                return getProductGroups(rgnIds, lst)
            }
            function closestMarketIds() {
                for (let jj = ii - 1; -1 < jj; jj--) {
                    const prevCrite = dfilter.getBlock(jj)
                    if (1 == prevCrite.Type) {
                        const landId = prevCrite.Ids[0]
                        if (landId < 0) return []
                        if (landId == 0) {
                            const markets = getMarkets(0, [])
                            return markets.map(x => x.Id)
                        }
                        const markets = getMarkets(landId, [])
                        return markets.map(x => x.Id)
                    }
                    if (5 == prevCrite.Type) {
                        const mkrId = prevCrite.Ids[0]
                        const markets = getMarkets(mkrId, [])
                        return markets.map(x => x.Id)
                    }
                }
                return []
            }
            function closestIds(ii, type) {
                for (let jj = ii - 1; -1 < jj; jj--) {
                    const crite = dfilter.getBlock(jj)
                    if (crite.Type == type) return crite.Ids
                }
                return []
            }
        }
    }, [cOperand, cType, cIds])
    const delRow = () => {
        onDelRow(ii)
    }
    const clssBtnDel = `btn btn-primary rounded-circle bi bi-trash-fill btn-del-crite-${ii} btn-del-crite`
    return (
        <div c-criterial={ii}>
            <input c-operand={ii} style={{ width: '96px' }} />
            <input c-type={ii} style={{ width: '270px' }} />
            <span className="ccrite-grp-ids"></span>
            {0 < ii ? <button className={clssBtnDel} type="button"
                onClick={() => delRow()}></button> : null}
        </div>
    )
}
const ReactFilter = ({ dfilter }) => {
    const [blocks, setBlocks] = useState(dfilter.getBlocks())
    const onDelRow = (ii) => {
        dfilter.removeBlock(ii)
        setBlocks([...dfilter.getBlocks()])
    }
    const addFilter = () => {
        const type = 0
        const isNewBlk = isNewBlock()
        let oprnd = isNewBlk ? Operands[1].Id : Operands[0].Id
        const criter = new Criterial(oprnd, type, getInitIds(type))
        dfilter.pushBlock(criter)
        setBlocks([...dfilter.getBlocks()])
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
        dfilter.onSearch()
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