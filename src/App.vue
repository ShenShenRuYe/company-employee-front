<template>
  <router-view />
</template>

<style>

*{
  padding: 0;
  margin: 0;
}
html{
  position: fixed;
  height: 100%;
  width: 100%;
}
body,#app{
  background-color: #eaeaea;
  height: 100%;
}
.card{

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 91px;
  background: #ffffff;
  box-shadow:  19px 19px 38px #c2c2c2,
  -19px -19px 38px #ffffff;
}
.dis_row{
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
.dis_column{
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}
</style>
