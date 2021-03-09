<template>
  <div class="form-container account">
    <div class="title-container">
      <h1 class="title">
        <span v-t="'title1'" />
        <span v-t="'title2'" />
      </h1>
      <p class="info-title">
        <span v-t="'subtitle'" />
      </p>
    </div>
  
    <ValidationObserver
      v-slot="{ invalid, }"
      key="account"
    >
      <form
        class="account-form"
      >
        <div class="form-control">
          <ValidationProvider
            v-slot="{ errors, classes, }"
            name="firstName"
            rules="required"
          >
            <a-input
              v-model="account.firstName"
              :class="classes"
              type="text"
              name="First name"
              class="input"
              :placeholder="$t('firstName')"
            />
            <label
              v-t="'firstName'"
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
            name="lastName"
            rules="required"
          >
            <a-input
              v-model="account.lastName"
              :class="classes"
              type="text"
              name="Last name"
              class="input"
              :placeholder="$t('lastName')"
            />
            <label
              v-t="'lastName'"
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
            name="gender"
            rules="required"
          >
            <a-select
              :value="account.gender"
              :class="classes"
              :placeholder="$t('genderPlaceholder')"
              @change="account.gender = $event"
            >
              <a-select-option value="male">
                {{ $t('male') }}
              </a-select-option>
              <a-select-option value="female">
                {{ $t('female') }}
              </a-select-option>
              <a-select-option value="other">
                {{ $t('nonBinary') }}
              </a-select-option>
            </a-select>
            <label
              v-t="'gender'"
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
            name="email"
            rules="required|email"
          >
            <a-input
              v-model="account.email"
              :class="classes"
              type="text"
              name="Email"
              class="input"
              :placeholder="$t('email')"
            />
            <label
              v-t="'email'"
              class="form-control-label"
            />
            <p class="error">
              {{ errors[0] }}
            </p>
          </ValidationProvider>
        </div>
  
        <div>
          <a-button
            v-t="'create'"
            class="submit-button"
            type="primary"
            :loading="buttonLoader"
            :disabled="invalid"
            @click="createMember"
          />
        </div>
      </form>
    </ValidationObserver>
    <div
      class="link-btn"
    >
      <span v-t="'haveAccount'" />
      <router-link :to="{ name: 'Login', query: { redirect: $route.query.redirect, }, }">
        {{ $t('signIn') }}
      </router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AccountCreateForm',
    i18n: {
      messages: {
        en: {
          title1: 'Create a',
          title2: 'New Account',
          subtitle: 'Create an account in Minespider to get access to the platform features',
          create: 'Create account',
          signIn: 'Sign In',
          email: 'Your email',
          firstName: 'Your name',
          lastName: 'Your last name',
          genderPlaceholder: 'Select gender',
          gender: 'Gender',
          male: 'Male',
          female: 'Female',
          nonBinary: 'Non-binary',
          haveAccount: 'Already have an account?'
        },
        de: {
          title1: 'Create a',
          title2: 'New Account',
          subtitle: 'Create an account in Minespider to get access to the platform features',
          create: 'Create account',
          signIn: 'Sign In',
          email: 'Your email',
          firstName: 'Your name',
          lastName: 'Your last name',
          genderPlaceholder: 'Select gender',
          gender: 'Gender',
          male: 'Male',
          female: 'Female',
          nonBinary: 'Non-binary',
          haveAccount: 'Already have an account?'
        }
      }
    },
    data() {
      return {
        buttonLoader: false,
        email: '',
        account: {
          firstName: '',
          lastName: '',
          gender: undefined,
          email: ''
        }
      };
    },
    methods: {
      async createMember() {
        this.buttonLoader = true;
        await this.$store.dispatch('CREATE_MEMBER', {
          entityId: this.$route.params.entityId,
          data: {
            firstName: this.account.firstName,
            lastName: this.account.lastName,
            email: this.account.email,
            gender: this.account.gender,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            invitation: {
              id: this.$route.params.hash
            }
          }
        });
        this.buttonLoader = false;
      }
    }
  };
</script>
