<template>
  <div class="form-control">
    <label
      class="form-control-label"
    >
      {{ label }}
    </label>
    <a-select
      ref="select"
      style="width: 100%"
      :class="[
        'form-control-select',
        selectClass
      ]"
      :mode="mode"
      :open="open"
      :value="selectValue"
      :show-search="showSearch"
      :placeholder="placeholder"
      :default-active-first-option="false"
      :filter-option="false"
      :show-arrow="true"
      :dropdown-class-name="dropdownClass"
      :not-found-content="null"
      :get-popup-container="trigger => trigger.parentNode"
      @focus="$emit('focus', $event)"
      @search="$emit('search', $event)"
      @change="$emit('change', $event)"
      @select="$emit('select', $event)"
      @dropdownVisibleChange="$emit('dropdown-visible-change', $event)"
      @popupScroll="onScroll"
    >
      <a-select-option
        v-for="option in selectData"
        :key="option.id"
      >
        <slot
          :option="option"
          name="optionContent"
        />
      </a-select-option>
      <div
        slot="dropdownRender"
        slot-scope="menu"
      >
        <v-nodes :vnodes="menu" />
       
        <slot name="customSearchItem" />
        <transition name="fade">
          <div
            v-show="loading"
            class="loading"
          >
            <a-icon type="loading" /> {{ $t('loading') }}
          </div>
        </transition>
        <slot name="customItem" />
      </div>
    </a-select>
    <div
      :class="{ open, }"
      class="overlay"
      @click="$emit('close-dropdown')"
    />
    <slot name="selectedList" />
  </div>
</template>
<script>
  
  export default {
    name: 'CustomSelect',
    i18n: {
      messages: {
        en: {
          loading: 'Loading'
        },
        de: {
          loading: 'Hochladen'
        }
      }
    },
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      }
    },
    props: {
      selectClass: String,
      mode: String,
      label: String,
      placeholder: String,
      dropdownClass: String,
      selectData: Array,
      isOpen: Boolean,
      selectValue: {
        type: String,
        default: undefined,
      },
      showSearch: {
        type: Boolean,
        default: true,
      },
      lazy: Boolean
    },
    data() {
      return {
        open: false,
        dropdownPage: 0,
        loadedPage: 0,
        limit: 15,
        loading: false,
        allLoaded: false
      };
    },
    watch: {
      isOpen(value) {
        this.open = value;
        if (!value) {
          this.$refs.select.blur();
          this.dropdownPage = 0;
          this.$emit('reset-list');
        } else {
          this.allLoaded = false;
          this.loadMore();
        }
      },
    },
    methods: {
      loadMore() {
        if (!this.lazy || this.loadedPage === this.dropdownPage && this.loadedPage > 0) return;
        this.loading = true;
        this.$emit('load-more', {
          offset: this.dropdownPage * this.limit,
          limit: this.limit,
          onLoadSuccess: this.onLoadSuccess,
        });
        this.loadedPage = this.dropdownPage;
      },
      onScroll(evt) {
        if(evt.target.scrollTop + evt.target.clientHeight >= evt.target.scrollHeight && !this.allLoaded) {
          this.loadMore();
        }
      },
      onLoadSuccess(dataLength, filteredDataLength) {
        this.dropdownPage += 1;
        this.loading = false;
        if (dataLength < this.limit) {
          this.allLoaded = true;
          return;
        }
        if (dataLength > 0 && filteredDataLength < 5) this.loadMore();
      }
    }
  };
</script>
