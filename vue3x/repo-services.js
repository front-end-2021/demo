import { getRandomInt } from "./common.js";
import {
    ListPrj, Langs,
    DemoLands, DemoRegions,
    DemoMarkets, DemoSubmarkets,
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
                case 3:         // Lands
                    resolve(DemoLands)
                    break;
                case 4:         // Regions
                    resolve(DemoRegions)
                    break;
                case 5:         // Markets
                    resolve(DemoMarkets)
                    break;
                case 6:         // Submarkets
                    resolve(DemoSubmarkets)
                    break;
            }
        }, getRandomInt(100, 999))
    })
}