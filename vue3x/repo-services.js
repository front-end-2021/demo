import { getRandomInt } from "./common.js";
import {
    ListPrj, Langs, NewLandIds,
    DemoLands, DemoRegions,
    DemoMarkets, DemoSubmarkets,
    DemoPrdGroups, DemoProducts,
    DemoGoals, DemoSubs, DemoTasks,
} from "./mock-data.js";

export const getData = (type) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            switch (type) {
                case 'List project': resolve(ListPrj)
                    break;
                case 'List language': resolve(Langs)
                    break;
                case 'List land': resolve(DemoLands)
                    break;
                case 'List region': resolve(DemoRegions)
                    break;
                case 'List market': resolve(DemoMarkets)
                    break;
                case 'List submarket': resolve(DemoSubmarkets)
                    break;
                case 'List product group': resolve(DemoPrdGroups)
                    break;
                case 'List product': resolve(DemoProducts)
                    break;
                case 'List goal': resolve(DemoGoals)
                    break;
                case 'List sub': resolve(DemoSubs)
                    break;
                case 'List task': resolve(DemoTasks)
                    break;
                case 'List new land id': resolve(NewLandIds)
                    break;
            }
        }, getRandomInt(100, 999))
    })
}