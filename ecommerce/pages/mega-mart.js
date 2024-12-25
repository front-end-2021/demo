import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'
const MxProduct = {
    props: ['type'],
    data() {
        return {
            Items: getItems(this.type),
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
    computed: {
        BorderItem() { return }
    },
}
const VwMobile = {
    template: `#tmp-vw-mobile`,
    name: "View-Mobile",
    display: "View.Mobile",
    mixins: [MxProduct],
    computed: {
        BorderItem() {
            return { border: '1px solid #dcdcdc69' }
        }
    },
}
const VwPrduct = {
    template: `#tmp-vw-product`,
    name: "View-Product",
    display: "View.Product",
    mixins: [MxProduct],
}
const VwCarousel = {
    template: `#tmp-vw-carousel`,
    name: "View-Carousel",
    display: "View.Carousel",
    computed: {
        IdSwiper() { return `swCarousel${Date.now()}` }
    },
    mounted() {
        const progressCircle = this.$el.querySelector(".autoplay-progress svg");
        const progressContent = this.$el.querySelector(".autoplay-progress span");
        let swiper = new Swiper(`#${this.IdSwiper}`, {
            pagination: {
                el: `.swiper-pagination.${this.IdSwiper}`,
                dynamicBullets: true,
            },
            autoplay: { delay: 3000, disableOnInteraction: false },
            on: {
                autoplayTimeLeft(s, time, progress) {
                    progressCircle.style.setProperty("--progress", 1 - progress);
                    progressContent.textContent = `${Math.ceil(time / 1000)}s`;
                }
            }
        });
    },
}
const VwBrands = {
    template: `#tmp-vw-brands`,
    name: "View-Brands",
    display: "View.Brands",
    mixins: [MxProduct],
    computed: {
        IdSwiper() { return `swBrand${Date.now()}` },
    },
    methods: {
        getBg(item) {
            switch (item.Name) {
                case 'iPhone': return {
                    backgroundColor: '#404040', color: 'white'
                }
                case 'REALME': return {
                    backgroundColor: '#fff3cc', color: '#222222'
                }
                case 'XIAOMI': return {
                    backgroundColor: '#ffecdf', color: '#222222'
                }
                case 'SamSunb': return {
                    backgroundColor: '#b6e4ed', color: '#222222'
                }
                case 'EXPERIA': return {
                    backgroundColor: '#7bdfc4', color: '#222222'
                }
            }
        },
        getBgName(item) {
            switch (item.Name) {
                case 'REALME': return { backgroundColor: '#fbdd7a7d' }
                case 'XIAOMI': return { backgroundColor: '#ffb8883d' }
                case 'SamSunb': return { backgroundColor: '#74d4e761' }
                default: break;
            }
            return { backgroundColor: '#ffffff3b' }
        },
        getBgImg(url){ return `url(${url})` },
    },
    mounted() {
        var swiper = new Swiper(`#${this.IdSwiper}`, {
            slidesPerView: 3,
            spaceBetween: 30,
            freeMode: true,
            pagination: {
                el: `.swiper-pagination.${this.IdSwiper}`,
                clickable: true,
                dynamicBullets: true,
            },
        });
    },
}
export const PageMegaMart = {
    template: `#tmp-pg-megamart`,
    name: "Page-MegaMart",
    display: "Page.MegaMart",
    components: {
        'vw-carousel': VwCarousel,
        'vw-mobile': VwMobile,
        'vw-product': VwPrduct,
        'vw-brands': VwBrands,
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
            lst.push({
                Name: 'Cosmetics',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSQv3-UE30ahGuM6sR6CPdedUmLtJGt5n4GA&s'
            })
            lst.push({
                Name: 'Electronic',
                img: 'https://www.meteorelectrical.com/media/wysiwyg/dev.jpeg'
            })
            lst.push({ Name: 'Funiture', img: '' })
            lst.push({ Name: 'Watches', img: '' })
            lst.push({ Name: 'Decor', img: '' })
            lst.push({ Name: 'Accessories', img: '' })
            break;
        case 'Brand':
        case 'brand':
            lst.push({ Name: 'iPhone', 
                logo: 'https://images.seeklogo.com/logo-png/15/1/apple-logo-png_seeklogo-158010.png?v=1958568110219184632',
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmmI1XO6V35fX43svG6fzJRBfvkev_yK6ToA&s', 
                event: 'UP to 50% OFF' })
            lst.push({ Name: 'REALME', 
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Realme-realme-_logo_box-RGB-01.png/1280px-Realme-realme-_logo_box-RGB-01.png',
                img: 'https://cdn.moglix.com/p/MN2ud8UtMeiIc-medium.jpg', 
                event: 'UP to 70% OFF' })
            lst.push({ Name: 'XIAOMI', 
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/512px-Xiaomi_logo_%282021-%29.svg.png',
                img: 'https://cdn-v2.didongviet.vn/files/products/2024/0/16/1/1705399483098_redmi_note_13_didongviet_thumb.png', 
                event: 'UP to 80% OFF' })
            lst.push({ Name: 'SamSunb', 
                img: 'https://smartviets.com/upload/A/A35%20xanh.png', 
                event: 'UP to 75% OFF' })
            lst.push({ Name: 'EXPERIA', 
                logo: 'https://download.logo.wine/logo/Sony_Xperia/Sony_Xperia-Logo.wine.png',
                img: 'https://sony.scene7.com/is/image/sonyglobalsolutions/Primary_image_Blue?$categorypdpnav$&fmt=png-alpha', 
                event: 'UP to 55% OFF' })
            break;
        case 'Essential':
        case 'essential':
            lst.push({ Name: 'Daily Essentials', 
                img: 'https://www.fodabox.com/cdn/shop/files/Essential-Fruit-Box.html_512x512.webp?v=1701794564', 
                event: 'UP to 50% OFF' })
            lst.push({ Name: 'Vegitables', 
                img: 'https://5.imimg.com/data5/SELLER/Default/2023/9/347623899/ND/LM/KG/37010748/vegetable.jpg', 
                event: 'UP to 70% OFF' })
            lst.push({ Name: 'Fruits', 
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1A-FsvqrAcOIskq-YGXlUjQcoR0ln3w6omw&s', 
                event: 'UP to 60% OFF' })
            lst.push({ Name: 'Strowberry', 
                img: 'https://media.gettyimages.com/id/73264456/photo/fresh-strawberry-close-up.jpg?s=612x612&w=gi&k=20&c=3o9u3tDoolwXtxKNk8LY3dVI7CFBOrMDUU7YFdpXLIY=', 
                event: 'UP to 55% OFF' })
            lst.push({ Name: 'Mango', 
                img: 'https://orchardfruit.com/cdn/shop/files/Mango-Whole-The-Orchard-Fruit-72136115.jpg?v=1722937809&width=300', 
                event: 'UP to 45% OFF' })
            lst.push({ Name: 'Cherry', 
                img: 'https://file.hstatic.net/1000301274/file/cherry-do-my_grande.png', 
                event: 'UP to 65% OFF' })
            break;
        default: break;
    }
    return lst;
}