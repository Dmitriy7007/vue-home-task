<template>
  <ul class="catalog__list">
    <ProductItem v-for="(product, index) in products" :key="index" :product="product"></ProductItem>
  </ul>
</template>

<script>
import products from '../data/products';
import ProductItem from './ProductItem.vue';

export default {
  components: { ProductItem },
  data() {
    return { products };
  },
};
</script>
