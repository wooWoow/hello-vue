<template>
  <div class="main-box">
    <div>
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
        <MonacoEditor height="400" theme="vs-dark" language="json" :code="code" :editorOptions="options"
          @mounted="onMounted" @codeChange="onCodeChange">
        </MonacoEditor>
      </div>

      <h2 class="top-title-box mt-20">执行命令</h2>
      <a-input class="commond-input" placeholder="input commond" v-model="commandStr" />
      <a-button type="primary" html-type="submit" @click="commindSearch">
        {{ $t('btn_query') }}
      </a-button>
    </div>

  </div>
</template>

<script>
import Request from '../service/request';
import MonacoEditor from 'vue-monaco-editor';

export default {
  name: 'Operations',
  data () {
    return {
      goldSelet: {
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
      },
      // 黄金
      code: '',
      editor: null,
      options: {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
        glyphMargin: true,
        showFoldingControls: "always",
        formatOnPaste: true,
        formatOnType: true,
        folding: true
      },
      // 命令
      commandStr: ''

    };
  },
  components: {
    MonacoEditor
  },
  created: function () {
    console.log('created');
  },
  destroyed: function () {
    console.log('destroyed');
  },
  methods: {
    handleChange (value) {
      this.goldSelet.selected = value;
    },
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
            that.editor.setValue(JSON.stringify(response.data.data));
            that.editor.trigger('', 'editor.action.format');
            that.editor.updateOptions({
              readOnly: true
            });
            that.editor.setValue(that.editor.getValue()); // 强制刷新一次
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onMounted (editor) {
      this.editor = editor;
    },
    onCodeChange (editor) {
      console.log(editor);
    },
    commindSearch () {
      const that = this;
      Request.get('v1/info/sysInfo', {
        params: {
          commond: that.commandStr
        }
      }).then(res => {
        if (res.data.code === 200) {
          console.log(res.data.data);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.main-box {
  text-align: left;
  padding-bottom: 100px;
}
.monaco-box {
  padding: 5px 20px;
}
.top-title-box {
  display: block;
  margin-left: 30px;
}
.top-select-box {
  min-width: 300px;
  margin: 20px 60px;
}
.commond-input {
  margin: 20px 60px;
  width: 300px;
}
</style>
