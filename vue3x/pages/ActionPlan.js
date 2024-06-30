
export default {
    template: `#tmp-comp-action-plan`,
    // components: {

    // },
    data() {
        return {
            UserInfo: {
                img: `https://allimages.sgp1.digitaloceanspaces.com/tipeduvn/2022/01/1642393308_940_Hinh-Anh-Girl-Xinh-Viet-Nam-Dep-De-Thuong-Cute.jpg`,
                header: `Profile`,
                content: {
                    head: `We've auto-chosen a profile image for you.`,
                    description: `We've grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a>
                image associated with your registered e-mail address.</p>
              <p>Is it okay to use this photo?`
                }
            },
            Users: ['Unassigned', 'Bill Gate', 'Elon Musk', 'Larry Page'],
            UserAssign: 'Assign',
        }
    },
    methods: {
        setUserAssign(val) {
            this.UserAssign = val;
            
        },
        openForm(type) {
            switch (type) {
                case 1:     // user
                    const saveClose = (mItem) => {
                        console.log('save close', mItem)
                        this.UserInfo = mItem
                    }
                    const exitClose = (mItem) => {
                        console.log('exit close', mItem)
                    }
                    const item = {
                        data: this.UserInfo,
                        type: `comp-modal`
                    }
                    this.$store.commit('setModal', [item, saveClose, exitClose])
                    break;
            }
        }
    }
}