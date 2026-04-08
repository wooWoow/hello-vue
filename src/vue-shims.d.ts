import { Store } from 'vuex';
import { Message } from 'ant-design-vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: Store<any>;
    $message: typeof Message;
    $form: any;
  }
}
