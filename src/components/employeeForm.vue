<template>
  <div>
    <el-form ref="employeeForm" :model="employeeFormData" :rules="rules" size="medium" label-width="100px"
      label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="employeeFormData.name" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="id_number">
        <el-input v-model="employeeFormData.id_number" placeholder="请输入身份证号" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="employeeFormData.gender" size="medium">
          <el-radio v-for="(item, index) in genderOptions" :key="index" :label="item.value" :disabled="item.disabled">{{
            item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="birth_date">
        <el-date-picker v-model="employeeFormData.birth_date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
          :style="{ width: '100%' }" placeholder="请选择出生日期" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input v-model="employeeFormData.department" placeholder="请输入部门" clearable
          :style="{ width: '100%' }"></el-input>
      </el-form-item>
      <el-form-item label="日薪" prop="salary_daily">
        <el-input v-model="employeeFormData.salary_daily" placeholder="请输入日薪" clearable
          :style="{ width: '100%' }"></el-input>
      </el-form-item>
      <el-form-item label="雇用日期" prop="hire_date">
        <el-date-picker v-model="employeeFormData.hire_date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
          :style="{ width: '100%' }" placeholder="请选择雇用日期" clearable></el-date-picker>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      employeeFormData: {
        id: undefined,
        name: undefined,
        id_number: undefined,
        gender: undefined,
        birth_date: "",
        department: undefined,
        salary_daily: "",
        hire_date: null,
      },
      rules: {
        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        id_number: [{
          required: true,
          message: '请输入身份证号',
          trigger: 'blur'
        }],
        gender: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        birth_date: [{
          required: true,
          message: '请选择出生日期',
          trigger: 'change'
        }],
        department: [{
          required: true,
          message: '请输入部门',
          trigger: 'blur'
        }],
        salary_daily: [{
          required: true,
          message: '请输入日薪',
          trigger: 'blur'
        }, {
          pattern: /^[+-]?\d+(\.\d+)?$/,
          message: '请输入正确数字',
          trigger: 'blur'
        }],
        hire_date: [{
          required: true,
          message: '请选择雇用日期',
          trigger: 'change'
        }],
      },
      genderOptions: [{
        "label": "男",
        "value": "男"
      }, {
        "label": "女",
        "value": "女"
      }],
      operation: ''
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    submitForm() {
      this.$refs['employeeForm'].validate(valid => {
        console.log(this.employeeFormData)
        if (!valid) return
        // TODO 提交表单
        if (this.operation === 'insert') {
          this.axios.post("/api/employee", this.employeeFormData)
            .then(res => {
              if (res.data.code === 0) {
                this.$message.success("增加成功")
              } else {
                this.$message.error("增加失败")
              }
            })
        }
        else if (this.operation === 'update') {
          this.employeeFormData.id = Number(this.employeeFormData.id)
          this.axios.put("/api/employee", this.employeeFormData)
            .then(res => {
              if (res.data.code === 0) {
                this.$message.success("修改成功")
              } else {
                this.$message.error("修改失败")
              }
            })
        }
      })
    },
    resetForm() {
      this.$refs['employeeForm'].resetFields()
    },
    setEmployee(val) {
      this.employeeFormData = val
    }
  }
}

</script>
<style></style>
