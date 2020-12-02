<template>
  <div class="main-box">
    <h2 class="top-title-box">{{ $t('gold_price_enquiry') }}</h2>
    <a-select class="top-select-box" mode="multiple" :default-value="goldSelet.selected" placeholder="Please select"
      @change="handleChange">
      <a-select-option v-for="gold in goldSelet.goldTypes" :key="gold.id">
        {{ gold.name }}
      </a-select-option>
    </a-select>
    <a-button type="primary" html-type="submit" @click="queryGoldPlace">
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
  goldSelet = {
    goldTypes: [
      {
        name: '黄金9999',
        id: 'au9999'
      },
      {
        name: '黄金T+D',
        id: 'auTplusD'
      }, {
        name: 'm黄金T+D',
        id: 'mAuTplusD'
      }, {
        name: '白银T+D',
        id: 'agTplusD'
      }, {
        name: '黄金9995',
        id: 'au9995'
      }, {
        name: '金条100g',
        id: 'au100g'
      }, {
        name: '黄金T+N1',
        id: 'auTplusN1'
      }, {
        name: '黄金T+N2',
        id: 'auTplusN2'
      }, {
        name: 'i黄金9999',
        id: 'sgiAu9999'
      }, {
        name: '白银9999',
        id: 'ag9999'
      }, {
        name: '铂金9995',
        id: 'pt9995'
      }
    ],
    selected: ['au9999']
  };

  // 黄金
  code = '';

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

  handleChange (value) {
    this.goldSelet.selected = value;
  };

  queryGoldPlace () {
    const str = this.goldSelet.selected.join(',');
    const that = this;
    Request.get('/v1/info/goldinfo',
      {
        params: {
          kinds: str
        }
      })
      .then(response => {
        if (response.data && response.data.code === 200 && response.data.data.code === 200) {
          that.$message.info(that.$i18n.tc('msg_query_success'));
          that.monacoEditor.setValue(JSON.stringify(response.data.data, null, 2));
        }
      })
      .catch(error => {
        console.log(error);
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
