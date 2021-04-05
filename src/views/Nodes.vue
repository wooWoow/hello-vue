<template>
  <div class="node-box">
    <div class="node-left">
      <div class="top-title">
        <span>{{showDustbin ? '回收站' : '最新文档'}}</span>
        <!-- 分类筛选 -->
        <span class="fr mr-40">分类：{{screenTypeStr}}</span>
        <a-select class="fr mt-10 mr-30 screenTypeBox" v-model="screenTypeId" @change="screenTypeChange">
          <a-select-option value="all">
            全部
          </a-select-option>
          <a-select-option v-for="type in nodeTypeList" :value="type.node_type_id" :key="type.node_id">
            {{type.node_type_str}}
          </a-select-option>
        </a-select>
        <!-- 垃圾箱 -->
        <a-tooltip placement="right">
          <template slot="title">
            显示/隐藏 删除笔记
          </template>
          <i class="iconfont icon-lajixiang cursor-pointer" v-bind:style="{ color: showDustbin ? '#42b983':'' }"
            @click="showDustbinFunc"></i>
        </a-tooltip>
      </div>
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
                <span class="node-item-type">{{item.node_type_str}}</span>
              </a-tooltip>
            </span>
          </div>
          <!-- 编辑 -->
          <svg class="iconfont cursor-pointer" style="left: calc(100% - 48px)" @click="editModelChange(item)"
            aria-hidden="true" v-if="!showDustbin">
            <use xlink:href="#icon-bianji"></use>
          </svg>
          <!-- 移出垃圾桶 -->
          <svg class="iconfont cursor-pointer" style="left: calc(100% - 48px)" @click="moveNodeToTrash(item, false)"
            aria-hidden="true" v-if="showDustbin">
            <use xlink:href="#icon-fanhui"></use>
          </svg>
          <!-- 移入垃圾桶 / 删除 -->
          <svg class="iconfont cursor-pointer" style="left: calc(100% - 40px)" @click="moveNodeToTrash(item, true)"
            aria-hidden="true">
            <use xlink:href="#icon-shanchu"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="node-right">
      <div class="node-title">
        <div class="node-title-box">
          <a-input placeholder="Title" :disabled="!editModel" @change="$editorChange" v-model="nodeTitle" />
        </div>
        <a-button class="fr mt-10 mr-20" @click="saveContent" v-if="editModel && isNodeChange">
          保存
        </a-button>
        <a-button class="fr mt-10 mr-20" @click="createNode" v-if="!isNodeChange && !showDustbin">
          新笔记
        </a-button>
        <!-- 笔记分类 -->
        <a-tooltip placement="bottom" v-show="editModel">
          <template slot="title">
            编辑分类
          </template>
          <i class="fr iconfont icon-shaixuan cursor-pointer mr-30" @click="editNodeType"></i>
        </a-tooltip>
        <a-select class="fr mt-10 mr-10" v-model="nodeTypeId" :disabled="!editModel" style="width: 120px"
          @change="nodeTypeChange">
          <a-select-option v-for="type in nodeTypeList" :value="type.node_type_id" :key="type.node_id">
            {{type.node_type_str}}
          </a-select-option>
        </a-select>
        <span class="fr">分类：</span>
        <!-- 编辑笔记 -->
        <a-modal v-model="showEditNodeTypy" title="编辑笔记类型" :footer="null">
          <div>
            <a-input class="mb-20 add_type_input" v-model="addNodeTypeStr" @pressEnter="addNodeType"
              placeholder="新增类型" />
            <span class="add_type_tip">回车即可保存</span>
          </div>
          <a-table :columns="typeColumns" :data-source="typeManageData" size="middle">
            <span slot="options" slot-scope="options">
              <a @click="delNodeType(options)">删除</a>
            </span>
          </a-table>
        </a-modal>
      </div>
      <div class="edit-box">
        <mavon-editor ref="md" placeholder="请输入文档内容..." :boxShadow="false" id="mavon-editor" v-model="content"
          :toolbarsFlag="editModel" :toolbars="toolbars" :subfield="editModel" :defaultOpen="'preview'"
          @imgAdd="$imgAdd" @change="$editorChange" @save="saveContent" />
      </div>
    </div>
  </div>
</template>
<script>
import Request from '../service/request';
import { dateFormat } from '@/service/tool';
import * as _ from 'lodash';

const typeColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '操作',
    dataIndex: 'options',
    key: 'options',
    scopedSlots: { customRender: 'options' }
  }
];

export default {
  name: 'Nodes',
  data () {
    return {
      userId: this.$cookies.get('userId'),
      nodeTitle: "",
      content: "",
      nodeList: [],
      activeNodeId: '',

      nodeTypeList: [],
      nodeTypeId: '',
      screenTypeId: 'all', // 筛选类型
      typeManageData: [],
      typeColumns,
      addNodeTypeStr: '',

      isNodeChange: false, // 笔记内容是否更改
      editModel: false, // 编辑模式
      showDustbin: false, // 是否显示垃圾箱
      showEditNodeTypy: false, // 显示笔记类型编辑modal
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
        preview: true // 预览
      }
    };
  },
  // 计算属性
  computed: {
    screenTypeStr: function () {
      return _.find(this.nodeTypeList, item => {
        return item.node_type_id === this.screenTypeId;
      })?.node_type_str || '全部';
    }
  },
  created: function () {
    this.queryNodeList(true);
    this.queryNodeType();
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
      Request.post('/v1/node/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(function (response) {
          let path = response.data.data.path || '';
          path = window.location.origin + '/' + path;
          setTimeout(() => {
            that.$refs.md.$img2Url(pos, path);
          }, 5000);
        });
    },
    $editorChange () {
      this.isNodeChange = true;
    },
    queryNodeType () {
      Request.get('/v1/node/type').then((res) => {
        if (res?.data?.code === 200 && res?.data?.data) {
          this.nodeTypeList = res.data.data;

          const formatList = _.map(this.nodeTypeList, item => {
            return {
              options: item.node_type_id,
              id: item.node_type_id,
              key: item.node_type_id,
              name: item.node_type_str
            };
          });
          this.typeManageData = formatList;
        }
      });
    },
    nodeTypeChange () {
      this.isNodeChange = true;
    },
    screenTypeChange () {
      this.queryNodeList(true);
    },
    editNodeType () {
      this.showEditNodeTypy = true;
    },
    addNodeType () {
      if (!this.addNodeTypeStr) {
        return;
      }
      const formData = {
        nodeTypeStr: this.addNodeTypeStr.trim()
      };
      Request.post('/v1/node/type/add', formData).then(res => {
        if (res?.data?.code === 501) {
          this.$message.error(res.data.data.err);
        } else {
          this.$message.success('新增成功');
          this.queryNodeType();
          this.addNodeTypeStr = '';
        }
      });
    },
    delNodeType (nodeTypeId) {
      const url = `/v1/node/type/${nodeTypeId}`;
      Request.delete(url).then(res => {
        if (res?.data?.code === 501) {
          this.$message.error(res.data.data.err);
        } else {
          this.$message.success('删除成功');
          this.queryNodeType();
        }
      });
    },
    saveContent () {
      const regStr = window.location.origin;
      let formData = {
        title: this.nodeTitle,
        content: this.content.replace(new RegExp(regStr, 'g'), '{{REPLACE_URL}}'),
        userId: this.userId,
        nodeTypeId: this.nodeTypeId
      };

      if (this.activeNodeId !== '') {
        formData = {
          title: this.nodeTitle,
          content: this.content.replace(new RegExp(regStr, 'g'), '{{REPLACE_URL}}'),
          userId: this.userId,
          nodeTypeId: this.nodeTypeId,
          nodeId: this.activeNodeId
        };
      }

      Request.post('/v1/node/save', formData).then((res) => {
        if (res?.data?.code === 200) {
          this.queryNodeList(this.activeNodeId === '');
        }
      });
    },
    queryNodeList (isInit) {
      const formData = {
        params: {
          userId: this.userId,
          display: this.showDustbin ? 0 : 1
        }
      };
      Request.get('/v1/node/query', formData).then(res => {
        if (res?.data?.code === 200 && res?.data?.data) {
          const list = res.data.data;
          list.forEach((item) => {
            let dateTime = new Date(item.node_date);
            dateTime = dateFormat(dateTime);
            item.date = dateTime.year + '-' + dateTime.month + '-' + dateTime.day;
            item.time = dateTime.hour + ':' + dateTime.minute + ':' + dateTime.sec;
          });

          // 分类筛选
          if (this.screenTypeId !== 'all') {
            const screenList = [];
            list.forEach((item) => {
              item.node_type_id === this.screenTypeId && screenList.push(item);
            });
            this.nodeList = screenList;
          } else {
            this.nodeList = list;
          }

          if (isInit && this.nodeList.length > 0) {
            this.activeNodeId = this.nodeList[0].node_id || '';
          } else if (isInit && this.nodeList.length === 0) {
            this.activeNodeId = '';
          }
          this.editModel = false;
          this.queryNode();
        }
      });
    },
    queryNode () {
      if (this.activeNodeId === '') {
        this.nodeTitle = '';
        this.content = '';
        this.activeNodeId = '';
        this.editModel = false;

        setTimeout(() => {
          this.isNodeChange = false;
        }, 100);
      }
      const formData = {
        params: {
          userId: this.userId,
          nodeId: this.activeNodeId
        }
      };
      Request.get('/v1/node/query', formData).then(res => {
        if (res?.data?.code === 200 && res?.data?.data.length > 0) {
          const node = res.data.data[0];
          this.content = node.node_content.replace(/{{REPLACE_URL}}/g, window.location.origin);
          this.nodeTitle = node.node_title;
          this.nodeTypeId = node.node_type_id;

          // 更新node状态
          setTimeout(() => {
            this.isNodeChange = false;
          }, 100);
        }
      });
    },
    clickNode (item) {
      if (this.isNodeChange) {
        this.$message.error('笔记已编辑未保存');
        return;
      }
      this.activeNodeId = item.node_id;
      this.editModel = false;
      this.queryNode(true);
    },
    moveNodeToTrash (item, type) {
      const url = `/v1/node/${item.node_id}`;
      const formData = {
        params: {
          userId: this.userId
        }
      };
      if (this.showDustbin && type) { // 删除
      } else {
        if (this.showDustbin && !type) { // 移出垃圾桶
          formData.params.display = 1;
        } else if (!this.showDustbin && type) { // 移入垃圾桶
          formData.params.display = 0;
        }
      }
      Request.delete(url, formData).then(res => {
        if (res?.data?.code === 200) {
          this.queryNodeList(this.activeNodeId === item.node_id);
        }
      });
    },
    showDustbinFunc () {
      if (this.isNodeChange) {
        this.$message.error('笔记已编辑未保存');
        return;
      }
      this.showDustbin = !this.showDustbin;
      this.queryNodeList(true);
    },
    editModelChange (item) {
      this.clickNode(item);
      this.editModel = true;
    },
    createNode () {
      this.nodeTitle = '';
      this.content = '';
      this.activeNodeId = '';
      this.editModel = true;
      this.nodeTypeId = this.nodeTypeList?.[0]?.node_type_id;

      setTimeout(() => {
        this.isNodeChange = false;
      }, 100);
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
  text-align: left;
  margin-left: 20px;
  border-bottom: 1px solid #eee;
  position: relative;
}
// 垃圾箱
.top-title .icon-lajixiang {
  position: absolute;
  display: inline-block;
  right: 5px;
  font-size: 18px;
  color: #ccc;
}
// 分类筛选
.top-title .icon-shaixuan {
  display: inline-block;
  font-size: 18px;
  color: #ccc;
}
.node-title {
  @extend .top-title;
  text-align: left;
}
.screenTypeBox {
  opacity: 0;
  position: absolute;
  width: 120px;
  left: 75px;
  z-index: 2;
}
.screenTypeBox:hover {
  opacity: 1;
}
.ant-select-dropdown {
  top: 50px !important;
}
.add_type_input {
  width: 200px;
}
.add_type_tip {
  color: #ddd;
  margin-left: 10px;
  font-weight: 300;
}
.node-left-overflow {
  height: calc(100% - 50px);
  overflow-y: auto;
}
.node-title-box {
  display: inline-block;
  height: 100%;
  max-width: 400px;
  .ant-input {
    border: none;
    font-weight: bold;
  }
  .ant-input:focus {
    box-shadow: none;
  }
  .ant-input[disabled] {
    background: none !important;
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
