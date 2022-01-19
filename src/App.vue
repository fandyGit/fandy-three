<template>
  <div id="app">
    <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
    >
      <el-sub-menu v-for="(item,index) in state.menuList" :index="index">
        <template #title>{{item.itemName}}</template>
        <el-menu-item v-for="ls in item.children" :index="ls.name">{{ls.name}}</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <router-view class="router-view"></router-view>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref,} from 'vue'
import { useRouter} from 'vue-router'
import { ElMenu, ElMenuItem, ElSubMenu} from 'element-plus'
  const router = useRouter()
  let state = reactive({
    menuList: [
      {
        itemName:'step01',
        children:[
          {name:'step0101',route:'/step0101'},
          {name:'step0102',route:'/step0102'},
          {name:'step0103',route:'/step0103'},
        ]
      },
      {
        itemName:'step02',
        children:[
          {name:'step0201',route:'/step0201'},
          {name:'step0202',route:'/step0202'},
          {name:'step0203',route:'/step0203'},
        ]
      },

    ]
  })
  const handleSelect = (routeName:String) => {
    router.push('/'+routeName)
  }

</script>

<style lang="scss">
html,body{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
