<template>
  <div>
    <el-form ref="salaryFrom" :model="$props.salary" :rules="rules" size="medium" label-width="100px"
             label-position="left">
      <el-form-item label="工资月份" prop="salary_date">
        <el-date-picker type="month" v-model="$props.salary.salary_date" format="YYYY-MM"
                        value-format="YYYY-MM" :style="{width: '100%'}" placeholder="请选择选工资月份"
                        clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="公积金" prop="accumulation_fund">
        <el-input v-model="$props.salary.accumulation_fund" placeholder="请输入公积金" clearable
                  :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="保险代扣" prop="insurance_expenses">
        <el-input v-model="$props.salary.insurance_expenses" placeholder="请输入保险代扣" clearable
                  :style="{width: '100%'}"></el-input>
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
  name: 'salaryForm',
  components: {},
  props: {
    salary: Object,
    employee: Object,
    operation: String,
  },
  data() {
    return {
      rules: {
        salary_date: [{
          required: true,
          message: '请选择选工资月份',
          trigger: 'change'
        }],
        accumulation_fund: [{
          required: true,
          message: '请输入公积金',
          trigger: 'blur'
        }],
        insurance_expenses: [{
          required: true,
          message: '请输入保险代扣',
          trigger: 'blur'
        }],
      }
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
      this.$refs['salaryFrom'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
        console.log(this.$props.operation)
        if (this.$props.operation === "update") {
          let data = {
            "id":Number(this.$props.salary.id),
            "employee_id": Number(this.$props.employee.id),
            "salary_date": this.$props.salary.salary_date,
            "insurance_expenses": Number(this.$props.salary.insurance_expenses),
            "accumulation_fund": Number(this.$props.salary.accumulation_fund)
          }
          this.$props.operation=""
          this.axios.put("/api/salary", data)
              .then(res => {
                if (res.data.code === 0) {
                  this.$message.success("修改成功")
                } else {
                  this.$message.error("修改失败")
                }

              })
        } else {
          let data = {
            "employee_id": Number(this.$props.employee.id),
            "salary_date": this.$props.salary.salary_date,
            "insurance_expenses": Number(this.$props.salary.insurance_expenses),
            "accumulation_fund": Number(this.$props.salary.accumulation_fund)
          }
          this.axios.post("/api/salary", data)
              .then(res => {
                if (res.data.code === 0) {
                  this.$message.success("增加成功")
                } else {
                  this.$message.error("增加失败")
                }
              })
        }
      })
    },
    resetForm() {
      this.$refs['salaryFrom'].resetFields()
    },
  }
}

</script>
<style>
</style>
