<template>
  <div class="operations-box">
    <div class="left-menu">
      <a-menu :default-selected-keys="['1']" @select="selectMenu" mode="inline" theme="light" :inline-collapsed="false">
        <a-menu-item key="1">
          <a-icon type="pie-chart" />
          <span>黄金</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="desktop" />
          <span>命令行</span>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="right-center">
      <gold-info v-if="showGold"/>
      <commond-info v-if="!showGold"/>
    </div>
  </div>
</template>

<script>
import GoldInfo from '@/components/GoldInfo.vue';
import CommondInfo from '@/components/CommondInfo.vue';

export default {
  name: 'Operations',
  components: {
    GoldInfo,
    CommondInfo
  },
  data () {
    return {
      showGold: true
    };
  },
  methods: {
    selectMenu: function($event) {
      this.showGold = !!($event.key === '1');
    }
  }
};
</script>

<style scoped lang="scss">
.operations-box {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}
.left-menu {
  margin-top: 10px;
  width: 200px;
  ul {
    height: 100%;
  }
}
.right-center {
  margin-top: 20px;
  flex: 1;
}
</style>
