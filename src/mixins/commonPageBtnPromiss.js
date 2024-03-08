export default {
    data() {
        return {
            pageBtntKeys: []
        }
    },
    watch: {
        $route: {
            handler: function (val, oldVal) {
                this.pageBtntKeys = [];

                // this.getPageBtnKeys()
            },
            // 深度观察监听
            deep: true
        }
    },
    methods: {
        getPageBtnKeys() {
            let { routeKey } = this.$route.meta;
            let info = JSON.parse(localStorage.getItem("userInfo")) || [];
            if (info.length <= 0) {
                this.pageBtntKeys = []
                return false
            }
            let permissions = info.permissions;
            let currentPageBtnList = []
            permissions.forEach(element => {
                let { parentRouteKey } = element
                if (parentRouteKey == routeKey) {
                    currentPageBtnList.push(element.routeKey)
                }
            });
            this.pageBtntKeys = currentPageBtnList
            console.log('this.pageBtntKeys', this.pageBtntKeys)
        },
        currentBtnShow(btnKey) {
            if (this.pageBtntKeys.length == 0) {
                this.getPageBtnKeys()
            }
            if (this.pageBtntKeys.indexOf(btnKey) > -1) {
                return true
            } else {
                return false
            }
        },
        getotherPageBtnKeys(otherPagekey) {
            let info = JSON.parse(localStorage.getItem("userInfo")) || [];
            if (info.length <= 0) {
                return false
            }
            let permissions = info.permissions;
            let otherPageBtnList = []
            permissions.forEach(element => {
                let { parentRouteKey } = element
                if (parentRouteKey == otherPagekey) {
                    otherPageBtnList.push(element.routeKey)
                }
            });
            return otherPageBtnList
        },
        otherBtnShow(otherPagekey, otherPagebtn) {
            let otherPageBtntKeys = []
            otherPageBtntKeys = this.getotherPageBtnKeys(otherPagekey)
            if (otherPageBtntKeys.indexOf(otherPagebtn) > -1) {
                return true
            } else {
                return false
            }
        },
    }
}

