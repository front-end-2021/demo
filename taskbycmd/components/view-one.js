import { groupByYear, sortMapByKey, groupByMonth, groupByDate, MonthsShort } from '../common.js'
import { RowSchedule } from './vw-diagram.js'
export const ViewOne = {
    template: `#tmp-view-one`,
    name: "View_One",
    display: "View.One",
    components: {
        'view-schedule': RowSchedule,
    },
    data() {
        return {
            ViewType: 1, // 1 = view group, 2 = view list
            ListGroup: [],
        }
    },
    methods: {
        buildData(type) {
            if (typeof type != 'number') type = this.ViewType
            if (2 == type) {
                if (this.ListGroup.length) this.ListGroup = []
                return;
            }
            const root = this.$root
            let items = root.LsSchedule
            let lsGroup = []
            let years = new Set()
            let map = groupByYear(items)
            map = sortMapByKey(map)
            for (const [year, objects] of map) {
                let mapMonth = groupByMonth(objects)
                mapMonth = sortMapByKey(mapMonth)
                map.set(year, mapMonth)
                years.add(year)
            }
            for (const [year, mapMonth] of map) {
                for (const [month, objects] of mapMonth) {
                    let mapDate = groupByDate(objects)
                    mapDate = sortMapByKey(mapDate)
                    mapMonth.set(month, mapDate)
                }
                map.set(year, mapMonth)
            }
            for (const [year, mapMonth] of map) {
                for (const [month, mapDate] of mapMonth) {
                    for (const [date, objects] of mapDate) {
                        let txtMonth = MonthsShort[month - 1]
                        let txtDate = date < 10 ? `0${date}` : `${date}`
                        let name = `${txtMonth.toUpperCase()} ${txtDate}`
                        if (1 < years.size) name = `${year} ${name}`
                        lsGroup.push({
                            Year_Month_Date: name,
                            Items: objects
                        })
                    }
                }
            }
            this.ListGroup = lsGroup
        },
        setViewType(type) {
            this.buildData(type)
            this.ViewType = type
        },
    },
    created() {
        const root = this.$root
        root.RefView = this
        this.buildData(this.ViewType)
    },
}