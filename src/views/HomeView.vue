<template>
  <div class="home dis_column">
    <div class="title home-card">
      <div v-if="showTable">员工信息表</div>
      <div v-else>员工详情信息</div>
    </div>
    <div class="dis_colum main">
      <div class="operation home-card ">
        <div class="operation-1">
          <el-select v-model="currentID" disabled placeholder="选择编号">
            <el-option
                v-for="(item,index) in employees"
                :key="index"
                :label="item.id"
                :value="item.id"
            />
          </el-select>
          <el-button v-if="showTable" @click="showDetail">员工详情</el-button>
          <el-button v-else @click="showDetail">刷新</el-button>
          <el-button @click="addEmployee" v-show="showTable">增加员工</el-button>
          <el-button @click="goBack" v-show="!showTable">返回</el-button>

        </div>
        <div class="operation-2">
          <el-button @click="logout">登出</el-button>
        </div>

      </div>
      <div class="table home-card">
        <el-table
            style="height: 100%;width: 100%"
            border stripe :data="employees"
            highlight-current-row
            @current-change="handleCurrentChange"
            v-show="showTable"
        >
          <el-table-column align="center" prop="id" label="编号" width="60"></el-table-column>
          <el-table-column align="center" prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column align="center" prop="gender" label="性别" width="60"></el-table-column>
          <el-table-column align="center" prop="birth_date" label="出生日期" width="130"></el-table-column>
          <el-table-column align="center" prop="hire_date" label="雇用日期" width="130"></el-table-column>
          <el-table-column align="center" prop="id_number" label="身份证号"></el-table-column>
          <el-table-column align="center" prop="department" label="部门" width="100"></el-table-column>
          <el-table-column align="center" prop="salary_daily" label="日薪" width="100"></el-table-column>
        </el-table>
        <div class="detail" v-show="!showTable">
          <el-descriptions :column="3" border title="员工信息">
            <el-descriptions-item align="center" label="编号">{{ employee.id }}</el-descriptions-item>
            <el-descriptions-item align="center" label="姓名">{{ employee.name }}</el-descriptions-item>
            <el-descriptions-item align="center" label="性别">{{ employee.gender }}</el-descriptions-item>
            <el-descriptions-item align="center" :span="2" label="身份证号">{{
                employee.id_number
              }}
            </el-descriptions-item>
            <el-descriptions-item align="center" label="部门">{{ employee.department }}</el-descriptions-item>
            <el-descriptions-item align="center" label="出生日期">{{ employee.birth_date }}</el-descriptions-item>
            <el-descriptions-item align="center" label="雇用日期">{{ employee.hire_date }}</el-descriptions-item>
            <el-descriptions-item align="center" label="日薪">{{ employee.salary_daily }}</el-descriptions-item>
            <template #extra>
              <el-button @click="showAttendance" size="small">查看考勤信息</el-button>
              <el-button @click="showOvertime" size="small">查看加班信息</el-button>
              <el-button @click="updateEmployee" type="info">修改</el-button>
              <el-button @click="deleteEmployee" type="danger">删除</el-button>
            </template>
          </el-descriptions>
          <div class="salary-table">
            <salary-table :employee="employee" :salaries="salaries"/>
          </div>
        </div>
      </div>
    </div>
    <el-dialog style="min-width:300px;" v-model="formVisible">
      <employee-form ref="employeeFromRef"/>
    </el-dialog>

    <el-dialog center style="min-width:300px; width: 80%;" v-model="attendanceVisible">
      <template #footer>
        <div class="dialog-header">
          <el-button @click="insertAttendance">增加考勤信息</el-button>
        </div>
      </template>
      <attendance-table ref="attendanceTable" :employee="employee" :attendances="attendances"/>
    </el-dialog>


    <el-dialog center style="min-width:300px; width: 80%;" v-model="overtimeVisible">
      <template #footer>
        <div class="dialog-header">
          <el-button @click="insertOvertime">增加加班信息</el-button>
        </div>
      </template>
      <overtime-table ref="overtimeTable" :employee="employee" :overtimes="overtimes"/>
    </el-dialog>


  </div>

</template>

<script>
import employeeForm from "@/components/employeeForm";
import attendanceTable from "@/components/attendanceTable";
import salaryTable from "@/components/salaryTable";
import OvertimeTable from "@/components/overtimeTable";

export default {
  name: 'HomeView',
  components: {OvertimeTable, employeeForm, attendanceTable, salaryTable},
  data() {
    return {
      employees: [],
      currentID: "",
      selectID: "",
      showTable: true,
      employee: {},
      formVisible: true,
      attendanceVisible: false,
      overtimeVisible: false,
      salaries: [],
      attendances: [],
      overtimes: [],
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentID = val.id
      this.employee = val
    },
    showDetail() {
      if (this.currentID) {
        this.showTable = false
        this.querySalary()
      } else {
        this.$message.error("请先选择员工！")
      }
    },
    goBack() {
      this.showTable = true
    },
    addEmployee() {
      this.formVisible = true
      this.$refs.employeeFromRef.setEmployee({})
      this.$refs.employeeFromRef.$data.operation = "insert"

    },
    updateEmployee() {
      this.formVisible = true
      this.$refs.employeeFromRef.setEmployee(this.employee)
      this.$refs.employeeFromRef.$data.operation = "update"

    },
    deleteEmployee() {
      this.$messageBox.confirm("确定删除吗", "注意！", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: 'warning'
      }).then(() => {
        this.employee.id = Number(this.employee.id)
        this.axios.delete("/api/employee", {data: this.employee}).then(res => {
          let resData = res.data
          if (resData.code === 0) {
            this.$message.success("删除成功！")
          } else {
            this.$message.error("删除失败！")
          }
        })
      })
    },
    querySalary() {
      this.axios.get("/api/salary", {
        params: {
          "employee_id": Number(this.employee.id)
        }
      }).then(res => {
        if (res.data.code === 0) {
          console.log(res.data)
          this.salaries = res.data.data
        } else {
          this.salaries = []
        }
      })
    },
    showAttendance() {
      this.attendanceVisible = true
      this.axios.get("/api/attendance", {
        params: {
          "employee_id": Number(this.employee.id)
        }
      }).then(res => {
        let data = res.data
        console.log("考勤信息", res.data)
        if (data.code === 0) {
          this.attendances = data.data
        } else {
          this.attendances = []
        }
      })
    },
    insertAttendance() {
      this.$refs.attendanceTable.formVisible = true
    },
    showOvertime() {
      this.overtimeVisible = true
      this.axios.get("/api/overtime", {
        params: {
          "employee_id": Number(this.employee.id)
        }
      }).then(res => {
        let data = res.data
        console.log("加班信息", res.data)
        if (data.code === 0) {
          this.overtimes = data.data
        } else {
          this.overtimes = []
        }
      })
    },
    insertOvertime() {
      this.$refs.overtimeTable.formVisible = true
    },
    logout(){
      localStorage.removeItem("user")
      this.$router.push("login")
    }
  },
  mounted() {
    this.formVisible = false
    this.axios.get("/api/employee").then(res => {
      console.log("员工信息",res.data)
      if (res.data.code === 0) {
        this.employees = res.data.data
      }

    })

  }

}
</script>

<style scoped>
.home {
  height: 100%;
  margin: 20px;
}

.main {
  position: relative;
  height: 85%;
}

.operation {
  margin: 15px 0;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.operation-1 {
  display: flex;
  column-gap: 20px;
}

.title {
  padding: 10px;
  font-family: 'Open Sans', sans-serif;
  font-size: 25px;
  font-weight: bolder;
  line-height: 1.5;
  color: #484848;
  text-align: center;
}

.table {
  position: relative;
  padding: 10px;
  height: 80%;

}

.home-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 12px 12px 24px #bababa,
  -12px -12px 24px #ffffff;
}

.detail {
  position: relative;
  height: 100%;
  width: 100%;
}

.salary-table {
  position: relative;
  margin: 10px 0;
  height: 50%;
  width: 100%;
}


</style>
