<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <li class="catalog__item" :product="product">
    <a class="catalog__pic" href="#">
      <img
        :src="product.image[indexColor]"
        :alt="product.title"
      />
    </a>

    <h3 class="catalog__title">
      <a href="#"> {{ product.title }} </a>
    </h3>

    <span class="catalog__price"> {{ product.price }} ₽ </span>

    <ul class="colors colors--black">
      <ProductColor v-for="(color, index) in colors" :color="color" :key="index" :current-color.sync="currentColorProduct" :id="product.id"/>
    </ul>
  </li>
</template>

<script>
import ProductColor from './ProductColor.vue';

export default {
  props: ['product', 'currentColorFilter'],
  components: { ProductColor },
  data() {
    return {
      currentColorProduct: this.product.colors[0],
    };
  },
  computed: {
    colors() {
      return this.product.colors;
    },
    indexColor() {
      return this.product.colors.findIndex((index) => index === this.currentColorProduct);
    },
    // currentColorProduct: {
    //   get() {
    //     if (this.currentColorFilter) {
    //       return this.currentColorFilter;
    //     }
    //     return this.product.colors[0];
    //   },
    //   // set(value) {
    //   // },
    // },
  },
  watch: {
    currentColorFilter(value) {
      this.currentColorProduct = value;
    },
  },
};
</script>
