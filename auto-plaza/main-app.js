// #region import
import {
    includeHTML
} from './common.js'

import MuaXe from './components/MuaXe.js'
import { createApp } from 'vue'
import VueObserveVisibility from 'vue3-observe-visibility'
// #endregion
Promise.all([
    includeHTML(`./components/MuaXe.html`),
    // includeHTML(`./pages/ActionPlan.html`),
    // includeHTML(`./forms/form-land.html`),
    // includeHTML(`./forms/AppWindow.html`),
]).then((values) => {
    const app = createApp({
        name: `app-main`,
        components: {
            'mua-xe': MuaXe,
        },
        data() {
            return {
                LsTab: ['Mua xe', 'Xe mới', 'Xe cũ', 'Xe đã bán', 'Cửa hàng xe cũ', 'Cửa hàng xe mới', 'Phụ kiện ô tô'],
                IndexTab: 0,
                LsRegion: ['Tất cả', 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'An Giang', 'Bà Rịa - Vũng Tàu', 
                    'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cao Bằng', 
                    'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 
                    'Hải Phòng', 'Hậu Giang', 'Hoà Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 
                    'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',  'Ninh Bình', 'Ninh Thuận',  'Phú Thọ', 'Phú Yên', 'Quảng Bình', 
                    'Quảng Nam', 'Quảng Ngãi' , 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 
                    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
                ],
                IndexRegion: 0,
                LsBrand: [
                    ['Toyota', 'https://e-cdn.carpla.vn/carpla-ecom/cms/toyota-1741528722.299.jpg'],
                    ['Ford', 'https://e-cdn.carpla.vn/carpla-ecom/cms/rectangle-40-1688111384711-1740992338.565.jpg'],
                    ['Mitsubishi', 'https://e-cdn.carpla.vn/carpla-ecom/cms/mitsubishi-1689062504582-1740991723.411.jpg'],
                    ['Hyundai', 'https://e-cdn.carpla.vn/carpla-ecom/cms/hyundai-1689126032166-1740992376.469.jpg'],
                    ['Honda', 'https://e-cdn.carpla.vn/carpla-ecom/cms/honda-1689061995100-1740992653.532.jpg'],
                    ['Mazda', 'https://e-cdn.carpla.vn/carpla-ecom/cms/mazda-1689126241247-1740992710.298.jpg'],
                    ['Nissan', 'https://e-cdn.carpla.vn/carpla-ecom/cms/nissan-1689126091459-1740992861.558.jpg'],
                    ['KIA', 'https://e-cdn.carpla.vn/carpla-ecom/cms/kia-1689062649479-1740992445.707.jpg'],
                    ['Geely', 'https://e-cdn.carpla.vn/carpla-ecom/cms/geely-auto-logo-1742267263.627.png'],
                    ['Vinfast', 'https://e-cdn.carpla.vn/carpla-ecom/cms/vinfat-1689061762968-1740995119.519.jpg'],
                    ['Mercedes-Benz', 'https://e-cdn.carpla.vn/carpla-ecom/cms/mec-1689062378822-1740992947.896.jpg'],
                    ['BMW', 'https://e-cdn.carpla.vn/carpla-ecom/cms/bmw-1689062063088-1740996029.911.jpg'],
                    ['Volvo', 'https://e-cdn.carpla.vn/carpla-ecom/cms/asset-14x-1672368643931-1740993300.830.jpg'],
                    ['MG', 'https://e-cdn.carpla.vn/carpla-ecom/cms/mg-1689061723485-1740995618.043.jpg'],
                    ['Lynk & Co', 'https://e-cdn.carpla.vn/carpla-ecom/cms/lynk-co-1741159426.252.png'],
                    ['Subaru', 'https://e-cdn.carpla.vn/carpla-ecom/cms/subaru-1690162051395-1740995752.563.jpg'],
                    ['Renault', 'https://e-cdn.carpla.vn/carpla-ecom/cms/renaultlgo-removebg-preview-1741072772.072.png'],
                    ['Isuzu', 'https://e-cdn.carpla.vn/carpla-ecom/cms/isuzu-1689062284790-1740995827.338.jpg'],
                    ['Peugeot', 'https://e-cdn.carpla.vn/carpla-ecom/cms/peugeot-1689061850237-1740994910.563.jpg'],
                    ['Suzuki', 'https://e-cdn.carpla.vn/carpla-ecom/cms/suzuki-1689062452237-1740994741.075.jpg'],
                    ['Audi', 'https://e-cdn.carpla.vn/carpla-ecom/cms/audi-1689061925953-1740996266.850.jpg'],
                    ['Lexus', 'https://e-cdn.carpla.vn/carpla-ecom/cms/lexus-1689062154037-1740996386.235.jpg'],
                ],
                IndexBrand: -1,
                LsYear: [
                    'Tất cả', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', 
                    '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006'
                ],
                IndexYear: 0,

                
            }
        },
        computed: {
            CompTab(){
                switch(this.IndexTab) {
                    case 0: return 'mua-xe';
                    case 1: return 'xe-moi';
                    case 2: return 'xe-cu';
                    case 3: return 'xe-da-ban';
                    case 4: return 'cua-hang-xe-cu';
                    case 5: return 'cua-hang-xe-moi';
                    case 6: return 'phu-kien-o-to';
                    default: return ''
                }
            },
        },
        watch: {
            
        },
        methods: {
            
        },
        //  beforeCreate() { },
        created() {
            
        },
        mounted() {
            values.forEach((path, ii) => { // console.log(path, ii)
                let pDom = document.body.querySelector(`.dnbimporthtml[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })
            
            const message = "123456";
            const hash = CryptoJS.SHA256(message);
            console.log('test sha256', hash.toString(CryptoJS.enc.Hex));

        },
    })
    app.directive('observe-visibility', VueObserveVisibility.ObserveVisibility)
    app.mount('#app')

}).catch(errStatus => { console.log('Woop!', errStatus) })
