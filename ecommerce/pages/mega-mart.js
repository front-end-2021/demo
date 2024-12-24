import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'
const VwPrduct = {
    template: `#tmp-vw-product`,
    name: "View-Product",
    display: "View.Product",
    props: ['type'],
    data() {
        return {
            Items: getItems(this.type),
        }
    },
    computed: {
        ViewTitle() {
            switch (this.type) {
                case 'Mobile':
                case 'mobile': return 'Grab the best deal on'
                case 'Category':
                case 'category': return 'Shop from'
                case 'Brand':
                case 'brand': return 'Top'
                case 'Essential':
                case 'essential': return 'Daily'
            }
        },
        ViewName() {
            switch (this.type) {
                case 'Mobile':
                case 'mobile': return 'Smartphones'
                case 'Category':
                case 'category': return 'Top Categories'
                case 'Brand':
                case 'brand': return 'Electronics Brands'
                case 'Essential':
                case 'essential': return 'Essentials'
            }
        },
        BorderItem(){
            switch(this.type) {
                case 'Mobile':
                case 'mobile': return {border: '1px solid #dcdcdc69'}
                default: return;
            }
        }
    },
    methods: {
        getBgImg(item) { return `url("${item.img}")` },
        getDiscount(item) {
            if (this.type != 'Mobile') return;
            let dc = item.Price - item.Sale
            dc = dc / item.Price * 100
            dc = Math.round(dc)
            return dc
        },
    },
}
export const PageMegaMart = {
    template: `#tmp-pg-megamart`,
    name: "Page-MegaMart",
    display: "Page.MegaMart",
    components: {
        'vw-product': VwPrduct,
    },
    //inject: [''],
    //mixins: [],
    // props: ['item'],
    data() {
        return {}
    },
    methods: {
        selectCate(cate) {
            const lstSelect = this.$root.SelecteCates
            let ii = lstSelect.findIndex(x => x == cate)
            if (-1 < ii) lstSelect.splice(ii, 1)
            else lstSelect.push(cate)
        },
        getClassSelectCate(cate) {
            const lstSelect = this.$root.SelecteCates
            if (lstSelect.includes(cate)) return 'bgm'
            return 'mbg'
        }
    },
    //beforeUnmount() { },
    mounted() {
        const progressCircle = document.querySelector(".autoplay-progress svg");
        const progressContent = document.querySelector(".autoplay-progress span");
        var swiper = new Swiper(".mySwiper", {
            pagination: {
                el: ".swiper-pagination",
                dynamicBullets: true,
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            on: {
                autoplayTimeLeft(s, time, progress) {
                    progressCircle.style.setProperty("--progress", 1 - progress);
                    progressContent.textContent = `${Math.ceil(time / 1000)}s`;
                }
            }
        });
    },
    updated() {

    },
}
function getItems(type) {
    const lst = []
    switch (type) {
        case 'Mobile':
        case 'mobile':
            lst.push({
                Name: 'Galaxy S22 Ultra',
                img: 'https://cdn.kalvo.com/uploads/img/large/45373-samsung-galaxy-s22-ultra-5g.jpg',
                Price: 85999, Sale: 67999, Currency: '&#8377;'
            })
            lst.push({
                Name: 'Galaxy M13 (4GB | 64GB)',
                img: 'https://cdn.kalvo.com/uploads/img/large/samsung-galaxy-m13-india.jpg',
                Price: 14999, Sale: 10499, Currency: '&#8377;'
            })
            lst.push({
                Name: 'Galaxy M33 (4GB | 64GB)',
                img: 'https://cdn.kalvo.com/uploads/img/large/samsung-galaxy-m33.jpg',
                Price: 24999, Sale: 16999, Currency: '&#8377;'
            })
            lst.push({
                Name: 'Galaxy M53 (4GB | 64GB)',
                img: 'https://cdn.kalvo.com/uploads/img/large/48581-samsung-galaxy-m53.jpg',
                Price: 40999, Sale: 31999, Currency: '&#8377;'
            })
            lst.push({
                Name: 'Galaxy S22 (Purl)',
                img: 'https://cdn.kalvo.com/uploads/img/large/samsung-galaxy-s22-5g.jpg',
                Price: 74999, Sale: 32999, Currency: '&#8377;'
            })
            break;
        case 'Category':
        case 'category':
            lst.push({ Name: 'Mobile', img: 'https://cdn.kalvo.com/uploads/img/large/apple-iphone-12-mini.jpg' })
            lst.push({ Name: 'Cosmetics', 
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSQv3-UE30ahGuM6sR6CPdedUmLtJGt5n4GA&s' })
            lst.push({ Name: 'Electronic', 
                img: 'https://www.meteorelectrical.com/media/wysiwyg/dev.jpeg' })
            lst.push({ Name: 'Funiture', img: '' })
            lst.push({ Name: 'Watches', img: '' })
            lst.push({ Name: 'Decor', img: '' })
            lst.push({ Name: 'Accessories', img: '' })
            break;
        case 'Brand':
        case 'brand':
            lst.push({ Name: 'iPhone', img: '', event: 'UP to 50% OFF' })
            lst.push({ Name: 'REALME', img: '', event: 'UP to 70% OFF' })
            lst.push({ Name: 'XIAOMI', img: '', event: 'UP to 80% OFF' })
            break;
        case 'Essential':
        case 'essential':
            lst.push({ Name: 'Daily Essentials', img: '', event: 'UP to 50% OFF' })
            lst.push({ Name: 'Vegitables', img: '', event: 'UP to 70% OFF' })
            lst.push({ Name: 'Fruits', img: '', event: 'UP to 60% OFF' })
            lst.push({ Name: 'Strowberry', img: '', event: 'UP to 55% OFF' })
            lst.push({ Name: 'Mango', img: '', event: 'UP to 45% OFF' })
            lst.push({ Name: 'Cherry', img: '', event: 'UP to 65% OFF' })
            break;
        default: break;
    }
    return lst;
}