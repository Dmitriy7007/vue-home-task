<!-- eslint-disable vue/no-deprecated-filter -->
<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img
        :src="product.image"
        :alt="product.title"
      />
    </router-link>

    <h3 class="catalog__title">
      <a href="#"> {{ product.title }} </a>
    </h3>

    <span class="catalog__price"> {{ product.price | numberFormat}} ₽ </span>

    <ul class="colors colors--black">
      <ProductColor v-for="(color, index) in colors" :color="color" :key="index" :current-color.sync="currentColorProduct" :id="product.id"/>
    </ul>
  </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';
import ProductColor from './ProductColor.vue';

export default {
  // props: ['product', 'currentColorFilter'],
  props: ['product'],
  components: { ProductColor },
  data() {
    return {
      // currentColorProduct: this.product.content[0].color,
      currentColorProduct: this.product.colors[0].code,
      // colors: this.product.content.map((el) => el.color),
      colors: this.product.colors.map((el) => el.code),
    };
  },
  filters: {
    numberFormat,
  },
  // computed: {
  //   indexColor() {
  //     return this.product.content.findIndex((item) => item.color === this.currentColorProduct);
  //   },
  // },
  methods: {
    gotoPage,
  },
  watch: {
    currentColorFilter(value) {
      this.currentColorProduct = value;
      this.colors = this.product.content.map((el) => el.color);
    },
  },
};
</script>
