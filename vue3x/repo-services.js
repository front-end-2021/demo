import { getRandomInt } from "./common.js";
import {
    ListPrj, Langs,
    DemoLands, DemoRegions,
    DemoMarkets, DemoSubmarkets,
    DemoPrdGroups, DemoProducts,
    DemoGoals, DemoSubs,
} from "./mock-data.js";

export const getData = (type) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            switch (type) {
                case 1:         // Project
                    resolve(ListPrj)
                    break;
                case 2:         // Languages
                    resolve(Langs)
                    break;
                case 3: resolve(DemoLands)
                    break;
                case 4: resolve(DemoRegions)
                    break;
                case 5: resolve(DemoMarkets)
                    break;
                case 6: resolve(DemoSubmarkets)
                    break;
                case 7: resolve(DemoPrdGroups)
                    break;
                case 8: resolve(DemoProducts)
                    break;
                case 9: resolve(DemoGoals)
                    break;
                case 10: resolve(DemoSubs)
                    break;
            }
        }, getRandomInt(100, 999))
    })
}