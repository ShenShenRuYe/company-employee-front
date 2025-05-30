<template>
  <div class="overtime-table">
    <el-table
        style="height: 100%;width: 100%; "
        border stripe :data="$props.overtimes"
    >
      <el-table-column align="center" prop="id" label="编号" min-width="60"></el-table-column>
      <el-table-column align="center" prop="employee_id" label="员工编号" min-width="100"></el-table-column>
      <el-table-column align="center" prop="date" label="日期" min-width="120"></el-table-column>
      <el-table-column align="center" prop="time" label="加班时长" min-width="100"></el-table-column>
      <el-table-column align="center" prop="hourly_wage" label="当日加班时薪" min-width="130"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" min-width="150">
        <template #default="scope">
          <el-button size="small" @click="handleEdit( scope.row)"
          >编辑
          </el-button
          >
          <el-button
              size="small"
              type="danger"
              @click="handleDelete( scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="formVisible">
    <el-form ref="overtimeFrom" :model="overtimeFromData" :rules="rules" size="medium" label-width="100px"
             label-position="left">
      <el-form-item label="加班日期" prop="date">
        <el-date-picker v-model="overtimeFromData.date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                        :style="{width: '100%'}" placeholder="请选择加班日期" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="加班时长" prop="time" required>
        <el-slider :max='24' :step='0.5' v-model="overtimeFromData.time"></el-slider>
      </el-form-item>
      <el-form-item label="加班时薪" prop="hourly_wage">
        <el-input v-model="overtimeFromData.hourly_wage" placeholder="请输入加班时薪" clearable
                  :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "overtimeTable",
  props: {
    overtimes: Array,
    employee: Object
  },
  data() {
    return {
      overtimeFromData: {
        date: null,
        time: "",
        hourly_wage: undefined,
      },
      rules: {
        date: [{
          required: true,
          message: '请选择加班日期',
          trigger: 'change'
        }],
        hourly_wage: [{
          required: true,
          message: '请输入加班时薪',
          trigger: 'blur'
        }],
      },
      formVisible: false,
      operation: ''
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
      this.$refs['overtimeFrom'].validate(valid => {
        if (!valid) return
        let data = {
          "id":Number(this.overtimeFromData.id),
          "employee_id": Number(this.employee.id),
          "time": Number(this.overtimeFromData.time),
          "date": this.overtimeFromData.date,
          "hourly_wage": Number(this.overtimeFromData.hourly_wage)
        }
        if (this.operation === "update") {
          this.axios.put("/api/overtime", data)
              .then(res => {
                if (res.data.code === 0) {
                  this.$message.success("修改成功")
                } else {
                  this.$message.error("修改失败")
                }
                this.overtimeFromData = {}
                this.formVisible = false
              })
        } else {
          this.axios.post("/api/overtime", data)
              .then(res => {
                if (res.data.code === 0) {
                  this.$message.success("增加成功")
                } else {
                  this.$message.error("增加失败")
                }
                this.overtimeFromData = {}
                this.formVisible = false
              })
        }

      })
    },
    resetForm() {
      this.$refs['overtimeFrom'].resetFields()
    },
    handleEdit(row){
      this.formVisible = true
      this.operation = "update"
      this.overtimeFromData=JSON.parse(JSON.stringify(row))
      this.overtimeFromData.time=Number(this.overtimeFromData.time)

    },
    handleDelete(row){
      this.$messageBox.confirm("确定删除吗", "注意！", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: 'warning'
      }).then(() => {
        let data = JSON.parse(JSON.stringify(row))
        data.id = Number(row.id)
        data.employee_id=Number(data.employee_id)
        data.hourly_wage=Number(data.hourly_wage)
        data.time=Number(data.time)
        this.axios.delete("/api/overtime", {data: data})
            .then(res => {
              let data = res.data
              if (data.code === 0) {
                this.$message.success("删除成功")
              } else {
                this.$message.error("删除失败")
              }
            })

      })
    }
  }

}
</script>

<style scoped>

</style>
