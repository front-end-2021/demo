import { apiSetIndexAction } from "../../service";
// import { LoadingContext } from "../../global/Context";
// import { useContext } from "react";
// import { deleteSubs, addSubs } from "../../global/ReduxStore/DataItem";
// import { useDispatch } from "react-redux";

export function setSortable($) {
    const elItems = this.rfActions.current
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
            this.LstDnD = lstFrom
            this.SrcSubId = srcTarget.getAttribute('idgrpdnd')
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
            const strFromIds = this.LstDnD.join('')

            if (strToIds !== strFromIds) {
                const DesSubId = $desTarget.attr('idgrpdnd')
                const itemId = $item.attr("id")
                let SrcIndex = srcTarget.getAttribute('idxdnd')
                SrcIndex = parseInt(SrcIndex)
                let DesIndex = $desTarget.attr('idxdnd')
                DesIndex = parseInt(DesIndex)

                if (this.SrcSubId != DesSubId) { // Khac Sub
                    $('.dnb_item_list_action').sortable('cancel');
                }

                processList.call(this,
                    { SubId: this.SrcSubId, Index: SrcIndex },
                    { SubId: DesSubId, Ids: lstTo, Index: DesIndex },
                    { Id: itemId })

                delete this.LstDnD
                delete this.SrcSubId
            }
        },
    }).disableSelection()
}
function processList(src, des, dragSub) {
    const { getActionsFrom } = this.props
    const { setLoading } = this.context
    const SrcSubId = src.SubId
    const DesSubId = des.SubId
    const DesIds = des.Ids

    setLoading(true)

    apiSetIndexAction({
        src: { SubId: SrcSubId },
        des: { SubId: DesSubId, Ids: DesIds },
        item: dragSub
    }).then(() => {
        const subids = SrcSubId !== DesSubId ? [SrcSubId, DesSubId] : [SrcSubId]
        getActionsFrom(subids)

        destroySortable.call(this, $)

        setLoading(false)
    })
}
export function destroySortable($) {
    const elItems = this.rfActions.current
    $(elItems).sortable('destroy')
}