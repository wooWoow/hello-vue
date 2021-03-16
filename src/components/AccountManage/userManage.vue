<template>
  <div class="main-box">
    <h2 class="top-title-box">用户管理</h2>
    <div class="m-30">
      <a-table :columns="userColumns" :data-source="userList">
        <span slot="options" slot-scope="options, record">
          <a @click="delUser(record)">删除</a>
          <a class="ml-10"
            @click="changeStatus(record)">{{record.statusNum === '0' ? '冻结' : record.statusNum === '1' ? '解冻' : ''}}</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Request from '../../service/request';
import { userStatusFormat } from '../../service/tool';
import * as _ from 'lodash';

@Component
export default class UserManage extends Vue {
  userId = '';

  userList = [];
  userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
    },
    {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      scopedSlots: { customRender: 'options' },
    },
  ];

  created() {
    this.userId = this.$store.state.userId;
    this.getUserList();
  }

  getUserList() {
    Request.get('/v1/users/getUser').then((res) => {
      if (res?.data?.code === 200) {
        const list: any = [];
        _.each(res?.data?.data, (user) => {
          list.push({
            id: user.user_id,
            name: user.user_name,
            statusNum: user.user_status,
            status: userStatusFormat(user.user_status),
            email: user.user_email,
            address: user.user_address,
            phone: user.user_phone,
            roles: user.user_roles
          });
        });

        this.userList = list;
      }
    });
  }

  delUser(row) {
    this.changeUserStatus(row.id, '2');
  }

  changeStatus(row) {
    this.changeUserStatus(row.id, row.statusNum === '0' ? '1' : '0');
  }

  changeUserStatus(userId, status) {
    Request.post('/v1/users/changeUserStatus', {
      status,
      userId
    }).then((res) => {
      if (res.data.code !== 200) {
        this.$message.error(res.data.msg);
      } else {
        this.$message.success(res.data.msg);
        this.getUserList();
      }
    });
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
</style>
