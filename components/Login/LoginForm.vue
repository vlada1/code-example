<template>
  <div class="form-container">
    <div
      v-if="!noTitle"
      class="title-container"
    >
      <h1 class="title">
        <span v-t="'title1'" />
        <span v-t="'title2'" />
      </h1>
      <p class="info-title">
        <span v-t="'subtitle'" />
      </p>
    </div>
    <ValidationObserver
      v-slot="{ invalid, touched, }"
      ref="loginForm"
    >
      <form
        role="form"
        class="login-form"
      >
        <div class="form-control">
          <ValidationProvider
            v-slot="{ errors, classes, }"
            name="username"
            rules="required|email"
          >
            <a-input
              v-model="username"
              :class="classes"
              type="text"
              name="username"
              class="input"
              :placeholder="$t('usernamePlaceholder')"
              :label="$t('usernameLabel')"
            />
            <label
              v-t="'usernameLabel'"
              class="form-control-label"
            />
            <p class="error">
              {{ errors[0] }}
            </p>
          </ValidationProvider>
        </div>
        <div class="form-control">
          <ValidationProvider
            v-slot="{ errors, classes, }"
            name="password"
            rules="required"
          >
            <a-input-password
              v-model="password"
              :class="classes"
              name="password"
              class="input"
              :placeholder="$t('passwordPlaceholder')"
              :label="$t('passwordLabel')"
              @keydown.enter="loginUser"
            />
            <label
              v-t="'passwordLabel'"
              class="form-control-label"
            />
            <p class="error">
              {{ errors[0] }}
            </p>
          </ValidationProvider>
        </div>
        <router-link
          :to="{ name: 'Restore Password', query: { redirect: $route.query.redirect, }, }"
          class="forgot-link"
        >
          {{ $t('forgot') }}
        </router-link>
        <div>
          <a-button
            v-t="'signIn'"
            class="submit-button"
            type="primary"
            :loading="isLoading"
            :disabled="invalid && touched"
            @click="loginUser"
          />
        </div>
      </form>
    </ValidationObserver>
    <!--    <div class="link-btn">-->
    <!--      <span> Don’t have an account?</span>-->
    <!--      <router-link :to="{ name: 'Create Account', query: { redirect: $route.query.redirect, }, }">-->
    <!--        Create-->
    <!--      </router-link>-->
    <!--    </div>-->
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'LoginForm',
    components: {},
  
    props: {
      noTitle: Boolean
    },
    i18n: {
      messages: {
        en: {
          title1: 'Welcome',
          title2: 'to Minespider',
          subtitle: 'To start working please enter your login and password',
          forgot: 'Forgot password?',
          signIn: 'Sign In',
          passwordLabel: 'Your password',
          passwordPlaceholder: 'Enter password',
          usernameLabel: 'Your username',
          usernamePlaceholder: 'Enter username'
        },
        de: {
          title1: 'Welcome',
          title2: 'to Minespider',
          subtitle: 'To start working please enter your login and password',
          forgot: 'Forgot password?',
          signIn: 'Sign In',
          passwordLabel: 'Your password',
          passwordPlaceholder: 'Enter password',
          usernameLabel: 'Your username',
          usernamePlaceholder: 'Enter username'
        }
      }
    },
    data() {
      return {
        token: null,
        username: '',
        password: '',
        buttonLoader: false,
      };
    },
    computed: {
      ...mapGetters([
        'isLoading'
      ]),
    },
    methods: {
      addError(key, message) {
        this.$refs.loginForm.setErrors({
          [key]: message
        });
      },
      async loginUser(evt) {
        evt.preventDefault();

        try {
          await this.$store.dispatch('LOGIN_USER', {
            username: this.username,
            password: this.password
          });
          
          this.$router.push(this.$route.query.redirect || '/shipments');
        } catch (e) {
          if (e.response) {
            this.addError('username', e.response.data.messages[0]);
            this.addError('password', e.response.data.messages[0]);
          }
        }
      }
    }
  };
</script>
