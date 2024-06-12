import dnbStore from './main-store.js'
export default {
    template: `#tmp-comp-nav`,
    computed: {
        count() { return dnbStore.getters.count }
    },
    methods: {
        upCount() {
            dnbStore.dispatch('increment').then(a => {
                //  console.log(a)
            })
        },
        resetCount() { dnbStore.dispatch('resetCount') },
        openModal() {
            dnbStore.dispatch('setModal', {
                img: `https://allimages.sgp1.digitaloceanspaces.com/tipeduvn/2022/01/1642393308_940_Hinh-Anh-Girl-Xinh-Viet-Nam-Dep-De-Thuong-Cute.jpg`,
                header: `Profile Picture`,
                description: {
                    head: `We've auto-chosen a profile image for you.`,
                    content: `We've grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a>
            image associated with your registered e-mail address.</p>
          <p>Is it okay to use this photo?`
                }
            }).then(item => {
                
            })
        },
    },
}