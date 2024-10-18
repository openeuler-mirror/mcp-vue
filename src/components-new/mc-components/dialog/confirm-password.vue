<!-- 二次密码校验 -->
<template>
  <mc-alert
    :title="title"
    :content-title="contentTitle"
    size="mini"
    top="30vh"
    :visible="true"
    icon="el-icon-warning"
    :before-close="closeHandle"
    :to-body="toBody"
    :loading="loading"
    @confirm="comfirmHandle"
    @close="closeHandle"
  >
    <p style="line-height: 1.5" v-html="contentMsg || $t('input_manger_password')" />
    <el-form ref="form" :model="form" :label-width="labelWidth" :rules="rulesModal" @submit.native.prevent>
      <el-form-item :label="passwordTitle" prop="pas">
        <el-input
          v-model="form.pas"
          type="password"
          size="mini"
          @keyup.enter.native="comfirmHandle"
        />
      </el-form-item>
    </el-form>
    <slot name="append" />
  </mc-alert>
</template>

<script>
import mcAlert from '@/components/mc-ui/dialog/mc-alert'
import { getConfirmPass } from '@/api/storage-pool/storage-pool'
import i18n from '@/lang'

// @group 组件组合的封装 mc-components
//  确认密码
export default {
  components: {
    mcAlert
  },
  props: {
    title: {
      type: String,
      default: i18n.t('common.tips')
    },
    show: {
      type: Boolean,
      default: true
    },
    contentTitle: {
      type: String,
      default: ''
    },
    contentMsg: {
      type: String,
      default: ''
    },
    // Dialog 自身是否插入至 body 元素上, 嵌套的 Dialog 必须指定该属性并赋值为 true
    toBody: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    istherPassword: {
      type: Boolean,
      default: false
    },
    passwordTitle: {
      type: String,
      default: i18n.t('mc-components.enter.administrator.password')
    },
    labelWidth: {
      type: String,
      default: '130px'
    }
  },
  data () {
    return {
      form: {
        pas: ''
      },
      rulesModal: {
        pas: { trigger: 'blur', required: true, message: this.$t('password_emtpy') }
      }
    }
  },
  watch: {
    show (val) {
      if (!val) {
        this.form.pas = ''
      }
    }
  },
  methods: {
    closeHandle () {
      this.$emit('update:show', false)
    },
    comfirmHandle () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.istherPassword) {
            getConfirmPass({
              password: this.form.pas
            }).then((res) => {
              this.$emit('successHandle', this.form.pas)
            }).catch((err) => {
              this.$refs['form'].fields[0].validateMessage = err
              this.$refs['form'].fields[0].validateState = 'error'
            })
          } else {
            this.$emit('successHandle', this.form.pas)
          }
        }
      })
    },
    async checkPas (rule, value, callback) {
      const data = await getConfirmPass()
      if (!data) {
        callback(new Error(this.$t('get_password_err')))
        return
      }
      if (!value) {
        callback(new Error(this.$t('password_emtpy')))
        return
      }
      callback()
    }
  }
}
</script>
