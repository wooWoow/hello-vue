<template>
  <div class="main-box">
    <h2 class="top-title-box mt-20">{{ $t('run_commond') }}</h2>
    <a-input class="commond-input" placeholder="input commond" v-model="commandStr" />
    <a-button type="primary" html-type="submit" @click="commindSearch">
      {{ $t('btn_query') }}
    </a-button>

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

  commindSearch () {
    const that = this;
    Request.post('v1/info/sysInfo', {
      params: {
        commond: that.commandStr
      }
    }).then(res => {
      if (res.data.code === 200) {
        that.monacoEditor.setValue(res.data.data.info);
      }
    });
  };
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
</style>
