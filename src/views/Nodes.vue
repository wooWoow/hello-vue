<template>
  <div class="node-box">
    <div class="node-left">
      <div class="top-title">最新文档</div>
      <div class="node-left-overflow">
        <div class="node-item" v-for="item in nodeList" :key="item.node_id">
          <div class="node-item-box" :class="{'node-item-box-active': item.node_id === activeNodeId}"
            @click="clickNode(item)">
            <span class="node-item-title hide-overflow-one cursor-pointer">{{item.node_title}}</span>
            <span class="node-item-time cursor-pointer">
              <!-- 带提示的时间 -->
              <a-tooltip placement="bottomLeft">
                <template slot="title">
                  {{item.time}}
                </template>
                <span class="mr-10">{{item.date}}</span>
                <span class="node-item-type">{{item.node_type}}</span>
              </a-tooltip>
            </span>
          </div>
          <svg class="iconfont cursor-pointer" @click="moveNodeToTrash(item)" aria-hidden="true">
            <use xlink:href="#icon-shanchu"></use>
            <!-- use是复制一个图标的意思 -->
          </svg>
        </div>
      </div>
    </div>
    <div class="node-right">
      <div class="node-title">
        <div class="node-title-box">
          <a-input placeholder="Title" v-model="nodeTitle" />
        </div>
        <a-button class="fr mt-10 mr-20" @click="saveContent">
          保存
        </a-button>
        <a-button class="fr mt-10 mr-20" @click="createNode">
          新笔记
        </a-button>
      </div>
      <div class="edit-box">
        <mavon-editor ref="md" placeholder="请输入文档内容..." :boxShadow="false" id="mavon-editor" v-model="content"
          :toolbars="toolbars" @imgAdd="$imgAdd" />
      </div>
    </div>
  </div>
</template>
<script>
import Request from '../service/request';
import { dateFormat } from '@/service/tool';
// import * as _ from 'lodash';

export default {
  name: 'Nodes',
  data () {
    return {
      nodeTitle: "",
      content: "",
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      nodeList: [],
      activeNodeId: ''
    };
  },
  created: function () {
    console.log('created');
    this.queryNodeList(true);
  },
  destroyed: function () {
    console.log('destroyed');
  },
  mounted () {
    console.log('mounted');
  },
  methods: {
    // 上传图片方法
    $imgAdd (pos, $file) {
      const formData = new FormData();
      formData.append('image', $file);

      const that = this;

      Request.post('/v1/info/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(function (response) {
          let path = response.data.data.path || '';
          path = window.location.origin + '/' + path;
          that.$refs.md.$img2Url(pos, path);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    saveContent () {
      const formData = {
        title: this.nodeTitle,
        content: this.content.replace(window.location.origin, '{{REPLACE_URL}}'),
        userId: 1,
        type: 'raspberry'
      };

      Request.post('/v1/info/node/save', formData).then(res => {
        console.log(res);
      });
    },
    queryNodeList (isInit) {
      const formData = {
        params: {
          userId: 1
        }
      };
      Request.get('/v1/info/node/query', formData).then(res => {
        if (res?.data?.code === 200 && res?.data?.data.length > 0) {
          const list = res.data.data;
          list.forEach((item) => {
            let dateTime = new Date(item.node_date);
            dateTime = dateFormat(dateTime);
            item.date = dateTime.year + '-' + dateTime.month + '-' + dateTime.day;
            item.time = dateTime.hour + ':' + dateTime.minute + ':' + dateTime.sec;
          });
          this.nodeList = list;

          if (isInit) {
            this.activeNodeId = this.nodeList[0].node_id || '';
            this.queryNode();
          }
        }
      });
    },
    queryNode () {
      const formData = {
        params: {
          userId: 1,
          nodeId: this.activeNodeId
        }
      };
      Request.get('/v1/info/node/query', formData).then(res => {
        if (res?.data?.code === 200 && res?.data?.data.length > 0) {
          const node = res.data.data[0];
          this.content = node.node_content.replace('{{REPLACE_URL}}', window.location.origin);
          this.nodeTitle = node.node_title;
        }
      });
    },
    clickNode (item) {
      this.activeNodeId = item.node_id;
      this.queryNode();
    },
    moveNodeToTrash (item) {
      const url = `/v1/info/node/${item.node_id}`;
      const formData = {
        params: {
          userId: 1
        }
      };
      Request.delete(url, formData).then(res => {
        if (res?.data?.code === 200) {
          this.queryNodeList(this.activeNodeId === item.node_id);
        }
      });
    },
    createNode () {
      this.nodeTitle = '';
      this.content = '';
      this.activeNodeId = '';
    }
  }
};
</script>
<style lang="scss">
#mavon-editor {
  z-index: 1;
  border: 1px solid #d9d9d9;
  height: 100%;
}
.node-box {
  display: flex;
  height: calc(100% - 50px);
  text-align: left;
}
.node-left {
  width: 250px;
  height: 100%;
  border-right: 1px solid #eee;
}
.node-right {
  flex: 1;
}
.top-title {
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
.node-title {
  @extend .top-title;
  text-align: left;
  padding-left: 20px;
}
.node-left-overflow {
  height: calc(100% - 50px);
  overflow-y: auto;
}
.node-title-box {
  display: inline-block;
  height: 100%;
  max-width: 500px;
  .ant-input {
    border: none;
  }
  .ant-input:focus {
    box-shadow: none;
  }
}
.node-item-box-active {
  background-color: #eee;
}
.node-item {
  height: 55px;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-radius: 5px;
  &:hover {
    background-color: #eee;
  }
  &:last-child {
    border-bottom: 1px solid #ddd;
  }
}
.node-item:hover {
  svg {
    display: inline-block;
    width: 16px;
    height: 16px;
  }
}
.node-item svg {
  display: none;
  position: relative;
  left: calc(100% - 28px);
  top: -34px;
}
.node-item-box {
  padding: 5px 10px;
  width: 100%;
  height: 100%;
}
.node-item-title {
  display: block;
  max-width: 200px;
  font-size: 16px;
  font-weight: bold;
}
.node-item-time {
  display: block;
  max-width: 180px;
}
.node-item-type {
  font-style: italic !important;
}
.edit-box {
  height: calc(100% - 50px);
}
</style>
