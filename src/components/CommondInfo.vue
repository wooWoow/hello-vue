<template>
  <div class="main-box">
    <h2 class="top-title-box mt-20">{{ $t('run_commond') }}</h2>
    <a-input class="commond-input" placeholder="input commond" v-model="commandStr" />
    <a-button type="primary" html-type="submit" @click="commindSearch(false)">
      {{ $t('btn_query') }}
    </a-button>

    <div class="commondItemBox">
      <template v-for="(item, key) in commandArr" >
        <span class="commondItem" v-bind:key="key">
          {{item}}
          <i class="delCommondItem cursor-pointer" @click="delCommondItem(key)">x</i>
        </span>
        <span v-if="commandArr.length !== (key + 1)" v-bind:key="key">  &&  </span>
      </template>
    </div>

    <div class="monaco-box">
      <div id='container' ref="container"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Request from '../service/request';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

@Component
export default class GoldInfo extends Vue {
  // 命令
  commandStr = '';
  commandArr: any = [];

  monacoEditor: any = null;

  monacoConfig = {
    value: '',
    fontSize: 14,
    language: 'javascript',
    theme: 'vs-dark',
    formatOnPaste: true,
    automaticLayout: true,
    readOnly: true,
    scrollbar: {
      verticalScrollbarSize: 5
    }
  };

  created () {
    setTimeout(() => {
      this.initEditor();
    },500);
  };

  initEditor() {
    const edit = document.getElementById('container') as HTMLElement;
    this.monacoEditor = monaco.editor.create(edit, this.monacoConfig);
  };

  commindSearch (skip: boolean) {
    const that = this;
    if (this.commandStr || skip) {
      if (!skip) {
        this.commandArr.push(this.commandStr);
        this.commandStr = '';
      }

      Request.post('v1/info/sysInfo', {
        params: {
          commond: this.commandArr.join('&&')
        }
      }).then(res => {
        if (res.data.code === 200) {
          that.monacoEditor.setValue(res.data.data.info);
        }
      });
    } else {
      that.$message.info('查询参数不能为空！');
    }
  };

  delCommondItem(index) {
    console.log(index);
    if (index === 0) {
      this.commandArr = [];
      this.monacoEditor.setValue('');
    } else {
      this.commandArr = this.commandArr.slice(0, index);
      this.commindSearch(true);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-box {
  text-align: left;
  padding-bottom: 100px;
}
.top-title-box {
  display: block;
  margin-left: 30px;
}
.commond-input {
  margin: 20px 60px;
  width: 300px;
}
.monaco-box {
  padding: 5px 20px;
}
#container {
  height: 400px;
}
.top-title-box {
  display: block;
  margin-left: 30px;
}
.top-select-box {
  min-width: 300px;
  margin: 20px 60px;
}
.commondItem {
  border: 1px solid #999;
  border-radius: 3px;
  padding: 0 8px;
  margin-right: 5px;
  line-height: 20px;
}
.commondItemBox {
  margin: 5px 20px;
}
.delCommondItem {
  display: inline-block;
  vertical-align: middle;
  width: 12px;
  height: 12px;
  line-height: 10px;
  border-radius: 12px;
  background-color: #bbb;
  margin: 0px;
  margin-left: 5px;
  padding: 0px;
  font-size: 10px;
  text-align: center;
}
</style>
