<template>
  <div class="attendance-table">
    <el-table
        style="height: 100%;width: 100%; "
        border stripe :data="$props.attendances"
    >
      <el-table-column align="center" prop="id" label="编号" min-width="60"></el-table-column>
      <el-table-column align="center" prop="employee_id" label="员工编号" min-width="100"></el-table-column>
      <el-table-column align="center" prop="date" label="日期" min-width="120"></el-table-column>
      <el-table-column align="center" prop="type" label="打卡类型" min-width="100"></el-table-column>
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
  <el-dialog v-model="formVisible" style="min-width: 500px">
    <div>
      <el-form ref="attendanceFrom" :model="attendanceFromData" :rules="rules" size="medium" label-width="100px"
               label-position="left">
        <el-form-item label="打卡日期" prop="date">
          <el-date-picker v-model="attendanceFromData.date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                          :style="{width: '100%'}" placeholder="请选择打卡日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="打卡类型" prop="type">
          <el-radio-group v-model="attendanceFromData.type" size="medium">
            <el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "attendanceTable",
  props: {
    attendances: Array,
    employee: Object
  },
  data() {
    return {
      attendanceFromData: {
        date: null,
        type: [],
      },
      rules: {
        date: [{
          required: true,
          message: '请选择打卡日期',
          trigger: 'change'
        }],
        type: [{
          required: true,
          message: '请至少选择一个打卡类型',
          trigger: 'change'
        }],
      },
      typeOptions: [
        {
          "label": "正常",
          "value": 1
        }, {
          "label": "迟到",
          "value": 2
        }, {
          "label": "早退",
          "value": 3
        }, {
          "label": "未打卡",
          "value": 4
        }],
      formVisible: false,
      operation: ""
    }
  },
  methods: {
    submitForm() {
      this.$refs['attendanceFrom'].validate(valid => {
        if (!valid) return
        let data = {
          "employee_id": Number(this.$props.employee.id),
          "date": this.attendanceFromData.date,
          "type": this.attendanceFromData.type
        }
        if (this.operation === "update") {
          data.id = this.attendanceFromData.id
          this.axios.put('/api/attendance', data)
              .then(res => {
                if (res.data.code === 0) {
                  this.$message.success("更新成功")
                  this.operation = ""
                  this.attendanceFromData = {}
                  this.formVisible = false
                } else {
                  this.$message.error("更新失败")
                }
              })
        } else {
          this.axios.post("/api/attendance", data)
              .then(res => {
                console.log(res.data)
                if (res.data.code === 0) {
                  this.$message.success("增加成功")
                  this.attendanceFromData = {}
                  this.formVisible = false
                } else {
                  this.$message.error("增加失败")
                }
              })
        }

      })
    },
    resetForm() {
      this.$refs['attendanceFrom'].resetFields()
    },
    handleEdit(row) {
      this.formVisible = true
      this.attendanceFromData = JSON.parse(JSON.stringify(row))
      this.attendanceFromData.id = Number(row.id)
      this.attendanceFromData.type = Number(row.type)
      this.operation = "update"
    },
    handleDelete(row) {
      this.$messageBox.confirm("确定删除吗", "注意！", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: 'warning'
      }).then(() => {
        let data = JSON.parse(JSON.stringify(row))
        data.id = Number(row.id)
        data.type = Number(row.type)
        data.employee_id=Number(data.employee_id)
        this.axios.delete("/api/attendance", {data: data})
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
.attendance-table {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
