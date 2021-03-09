<template>
  <div class="login-page">
    <a-card
      :bordered="false"
      class="login-container"
    >
      <div class="logo">
        <img
          src="img/logo_big.svg"
          alt="Minespider logo"
        >
      </div>
      <slot />
      <div class="copyright text-center">
        © {{ year }}
        <a
          href="https://www.minespider.com/"
          target="_blank"
        >Minespider</a>
        <span class="version"> - v{{ pjson.version }}</span>
      </div>
    </a-card>
  </div>
</template>
<script>
  import pjson from '../../../package';
  
  export default {
    data() {
      return {
        year: new Date().getFullYear(),
        pjson
      };
    }
  };
</script>

<style lang="scss">
  @import 'styles/page-template';
</style>
