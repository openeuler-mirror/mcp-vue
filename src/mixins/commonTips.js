export default {
  methods: {
    alertConfirm(msg) {
      return this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true
      })
    },
    alertDialog(msg, title = '提示') {
      return this.$alert(msg, title, {
        dangerouslyUseHTMLString: true
      })
    },
    alertTips(msg, type = 'error') {
      this.$rmsg[type]({
        showClose: true,
        message: msg,
        type: type
      })
    }
  }
}

