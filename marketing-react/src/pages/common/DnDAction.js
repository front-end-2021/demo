import React, { useContext, useMemo, useEffect } from "react"
import { useSelector } from "react-redux"
import { ItemContext } from "../../global/Context"
import { ActionView } from "../Marketing/Action"
import { useDispatch } from "react-redux"
import { setIndexActions } from "../../global/ReduxStore/DataItem"

export function DnDAction({ index, children, isExpand, isDoneMain }) {
    const rfActions = React.createRef();
    const item = useContext(ItemContext)            // sub
    const IsDnD = useSelector(state => state.navbar.CanDrgDrp)

    useEffect(() => {
        if (IsDnD && Array.isArray(item.Actions)) {
            setSortable()
        }
        else {
            destroySortable()
        }
        return () => { destroySortable() }  // unMount
    }, [IsDnD, item.Actions])

    const dispatch = useDispatch()

    function setSortable() {
        const elItems = rfActions.current
        $(elItems).sortable({
            connectWith: '.dnb_item_list_action',
            axis: 'y',
            cancel: '.dnb_item_done,.dnb_add_action',
            handle: '.dnb_item_title',
            //placeholder: "ui-state-highlight",
            //  placeholder: 'dnb-dnd-item-ghost',
            start: (evt, ui) => {
                const lstFrom = []
                const srcTarget = evt.currentTarget;
                srcTarget.querySelectorAll(".dnbDndItem").forEach((n) => {
                    lstFrom.push(n.getAttribute("id"));
                })
                item.LstDnD = lstFrom;                              // extend
                item.SrcSubId = srcTarget.getAttribute('idgrpdnd'); // extend
            },
            stop: (evt, ui) => {
                const lstTo = [];
                const $item = ui.item
                const srcTarget = evt.target;
                const $desTarget = $item.closest(`.dnb_item_list_action`)
                $desTarget.find(".dnbDndItem").each(function () {
                    lstTo.push(this.getAttribute("id"));
                })
                const strToIds = lstTo.join('')
                const strFromIds = item.LstDnD.join('')

                if (strToIds !== strFromIds) {
                    const DesSubId = $desTarget.attr('idgrpdnd')
                    const itemId = $item.attr("id")
                    let SrcIndex = srcTarget.getAttribute('idxdnd')
                    SrcIndex = parseInt(SrcIndex)
                    let DesIndex = $desTarget.attr('idxdnd')
                    DesIndex = parseInt(DesIndex)

                    const srcSubId = item.SrcSubId
                    if (srcSubId != DesSubId) { // Khac Sub
                        $(`.dnb_item_list_action`).sortable('cancel');  // Cancel het de React remove child khong bi loi
                    }
                    processList(
                        { SubId: srcSubId, Index: SrcIndex },
                        { SubId: DesSubId, Ids: lstTo, Index: DesIndex },
                        { Id: itemId }
                    )
                    delete item.LstDnD;             // delete extend
                    delete item.SrcSubId;           // delete extend
                }
            },
        }).disableSelection()
    }
    function processList(src, des, dragSub) {
        const SrcSubId = src.SubId
        const DesSubId = des.SubId
        const DesIds = des.Ids

        destroySortable()

        dispatch(setIndexActions({
            src: { SubId: SrcSubId },
            des: { SubId: DesSubId, Ids: DesIds },
            item: dragSub
        }))
    }
    function destroySortable() {
        const elItems = rfActions.current
        if ($(elItems).sortable('instance') != undefined)
            $(elItems).sortable('destroy')
    }

    const listAction = useMemo(
        () => Array.isArray(item.Actions) ? item.Actions : [],
        [item.Actions]
    );
    const isDoneSub = useMemo(
        () => isDoneMain || item.IsDone,
        [isDoneMain, item.IsDone]
    )
    const clssGrpA = useMemo(
        () => `dnb_item_list_action${IsDnD ? ' dnb-dnd-items' : ''}`,
        [IsDnD]
    )
    return (
        <div className={clssGrpA} ref={rfActions}
            idgrpdnd={IsDnD ? item.Id : undefined}
            idxdnd={IsDnD ? index : undefined}>{
                !listAction.length ?
                    <>{children}</> :
                    <>{listAction.map(_a => {
                        return <ActionView key={_a.Id}
                            item={_a}
                            isExpandSub={isExpand}
                            isDoneSub={isDoneSub} />
                    })}
                        {children}</>
            }</div>
    )
}