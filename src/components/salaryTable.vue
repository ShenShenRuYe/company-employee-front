<template>
  <div class="header">
    <h4>员工工资</h4>
    <div class="btns">

      <el-button type="primary" @click="insertSalary">生成</el-button>
    </div>
  </div>
  <el-table
      style="height: 100%;width: 100%"
      border stripe :data="$props.salaries"
  >
    <el-table-column align="center" prop="id" label="编号" min-width="60"></el-table-column>
    <el-table-column align="center" prop="employee_id" label="员工编号" min-width="100"></el-table-column>
    <el-table-column align="center" prop="salary_date" label="日期" min-width="120"></el-table-column>
    <el-table-column align="center" prop="base_salary" label="基本工资" min-width="100"></el-table-column>
    <el-table-column align="center" prop="attendance_allowance" label="全勤补贴" min-width="100"></el-table-column>
    <el-table-column align="center" prop="overtime_allowance" label="加班补贴" min-width="100"></el-table-column>
    <el-table-column align="center" prop="accumulation_fund" label="公积金" min-width="100"></el-table-column>
    <el-table-column align="center" prop="insurance_expenses" label="保险代扣" min-width="100"></el-table-column>
    <el-table-column align="center" prop="total_salary" label="总金额" min-width="100"></el-table-column>
    <el-table-column align="center" fixed="right" label="操作" min-width="150">
      <template #default="scope">
        <el-button size="small" @click="handleUpdate(scope.row)">更新</el-button>
        <el-button
            size="small"
            type="danger"
            @click="handleDelete( scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog center style="min-width:300px; width: 80%;" v-model="salaryFormVisible">
    <salary-form  ref="salaryFormRef" :operation="operation" :salary="salary" :employee="$props.employee"></salary-form>
  </el-dialog>
</template>

<script>
import salaryForm from "@/components/salaryForm";

export default {
  name: "salaryTable",
  props: {
    salaries: [],
    employee:Object
  },
  components:{
    salaryForm
  },
  data() {
    return {
      salary:{},
      salaryFormVisible:false,
      operation:''
    }
  },
  methods: {
    handleDelete(row) {
      let salary = JSON.parse(JSON.stringify(row))

      salary.id = Number(salary.id)
      salary.accumulation_fund = Number(salary.accumulation_fund)
      salary.attendance_allowance = Number(salary.attendance_allowance)
      salary.base_salary = Number(salary.base_salary)
      salary.employee_id = Number(salary.employee_id)
      salary.insurance_expenses = Number(salary.insurance_expenses)
      salary.overtime_allowance = Number(salary.overtime_allowance)

      this.$messageBox.confirm("确定删除吗", "注意！", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: 'warning'
      }).then(() => {
        this.axios.delete("/api/salary", {data: salary})
            .then(res => {
              let data = res.data
              if (data.code === 0) {
                this.$message.success("删除成功")
                row = null
              } else {
                this.$message.error("删除失败")
              }
            })

      })
    },
    handleUpdate(row){
      this.salary=row
      this.salaryFormVisible=true
      this.operation='update'

    },
    insertSalary(){
      this.salary={}
      this.salaryFormVisible=true
      this.operation=''
    }
  }
}
</script>

<style scoped>


.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0;
}
</style>
