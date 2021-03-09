import { defineFeature, loadFeature } from 'jest-cucumber';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import LoginForm from '../LoginForm';

const feature = loadFeature('src/specs/features/login.feature');

defineFeature(feature, test => {
  let localVue;
  let actions;
  let store;
  let router;
  let pushSpy;

  beforeEach(() => {
    localVue = global.globalVue;
  });

  test('Entering credentials and clicking the login button', ({ given, when, then }) => {
    let wrapper;

    given('an instance of our Login component', () => {
      localVue = global.globalVue;
      actions = {
        'LOGIN_USER': jest.fn().mockImplementation(() => {
          return {
            mnemonic: "evidence thing glass escape spike ivory brother salmon culture such move muffin"
          }
        }),
      };
      store = new Vuex.Store({
        actions,
        getters: {
          isLoading: () => false
        }
      });

      router = new VueRouter({
        routes: [
          {
            path: 'shipments',
            name: 'Shipments',
            component: {render: h => '-'}
          }
        ]
      });

      wrapper = mount(LoginForm, {
        localVue,
        store,
        router,
      });

      pushSpy = jest.spyOn(wrapper.vm.$router, 'push');
    });

    when('I enter a username', () => {
      wrapper.find('input[type=text]').setValue('it-account@minespider.com');
    });

    when('I enter a password', () => {
      wrapper.find('input[type=password]').setValue('1234567');
    });

    when('I click the login button', () => {
      wrapper.find('button.submit-button').trigger('click');
    });

    then('I expect the login handler method to be executed', async () => {
      await wrapper.vm.$nextTick();
      expect(actions['LOGIN_USER']).toHaveBeenCalled();
    });

    then('I expect app to go to main page', async () => {
      await wrapper.vm.$nextTick();
      expect(pushSpy).toHaveBeenCalledWith('/shipments');
      expect(wrapper.vm.$route.path).toBe('/shipments');
    });
  });

  test('Entering wrong credentials, clicking the login button ang getting an error', ({ given, when, then }) => {
    let wrapper;
    let notificationSpy;
    let $notification = {
      error: jest.fn()
    };
    let addErrorStub = sinon.stub();

    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/login').reply(401, {
      messages: [
        'Invalid credentials'
      ]
    });

    given('an instance of our Login component', () => {
      localVue = global.globalVue;
      actions = {
        'LOGIN_USER': jest.fn().mockImplementation(() => {
          return axios
            .post('login')
            .catch(e => {
              throw e;
            });
        }),
      };
      store = new Vuex.Store({
        actions,
        getters: {
          isLoading: () => false
        }
      });

      router = new VueRouter();

      wrapper = mount(LoginForm, {
        localVue,
        store,
        router,
        mocks: {
          $notification,
          addError: jest.fn()
        }
      });

      pushSpy = jest.spyOn(wrapper.vm.$router, 'push');
      notificationSpy = jest.spyOn(wrapper.vm.$notification, 'error');
      wrapper.vm.addError = addErrorStub;
    });

    when('I enter a wrong username', () => {
      wrapper.find('input[type=text]').setValue('test@test.com');
    });

    when('I enter a wrong password', () => {
      wrapper.find('input[type=password]').setValue('123');
    });

    when('I click the login button', () => {
      wrapper.find('button.submit-button').trigger('click');
    });

    then('I expect the login handler method to be executed with error', async () => {
      await wrapper.vm.$nextTick();
      await expect(actions['LOGIN_USER']).toHaveBeenCalled();
    });

    then('I expect app to stay on current page', async () => {
      await wrapper.vm.$nextTick();
      expect(pushSpy).not.toHaveBeenCalled();
      await wrapper.vm.$nextTick();
      await expect(notificationSpy).toHaveBeenCalled();
      expect(addErrorStub.withArgs('Username', 'Invalid credentials').callCount).toBe(1);
      expect(addErrorStub.withArgs('Password', 'Invalid credentials').callCount).toBe(1);
    });
  });
});

