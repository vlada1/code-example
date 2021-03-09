import Ant from 'ant-design-vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import { createLocalVue } from '@vue/test-utils';
import { MESSAGES } from '@/shared/messages';

extend('required', {
  ...required,
});

extend('email', {
  ...email,
});

let globalVue;
let i18n;

beforeEach(() => {
  globalVue = createLocalVue();
  globalVue.use(Vuex);
  globalVue.use(VueRouter);
  globalVue.use(Ant);
  globalVue.use(VueI18n);
  i18n = new VueI18n({
    locale: 'en',
    messages: MESSAGES
  });
  globalVue.prototype._i18n = i18n;
  globalVue.component('ValidationObserver', ValidationObserver);
  globalVue.component('ValidationProvider', ValidationProvider);
  global.globalVue = globalVue;
});
