<template>
  <div id="login">
    <div class="card dis_column">
      <h1>登录</h1>
      <el-form class="form" ref="accountForm" :model="accountFormData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="accountFormData.account" placeholder="请输入账号" :style="{width: '200px'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="accountFormData.password" placeholder="请输入密码" clearable show-password
                    :style="{width: '200px'}"></el-input>
        </el-form-item>

      </el-form>
      <div class="btns">
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
    <div>

    </div>
  </div>
</template>
<script>

export default {
  components: {

  },
  props: [],
  data() {
    return {
      accountFormData: {
        account: "",
        password: "",
      },
      rules: {
        account: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    submitForm() {
      this.$refs['accountForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单

        this.axios.post("/api/admin", {...this.accountFormData})
            .then(res => {
              let resp = res.data
              if (resp.code === 0) {
                this.$message.success(`登录成功，欢迎您，${resp.data}！`)
                localStorage.setItem("user", `${this.accountFormData.account}-${resp.data}`)
                this.$router.push({name: "home"})
              } else {
                this.$message.error("登录失败！")
              }
            })
      })
    },
    resetForm() {
      this.$refs['accountForm'].resetFields()
    },
  }
}

</script>
<style scoped>
#login {

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

h1 {

  font-family: 'Open Sans', sans-serif;
  font-size: 25px;
  line-height: 1.5;
  color: #484848;

}

.form {
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
</style>
