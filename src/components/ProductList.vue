<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<!-- eslint-disable max-len -->
<template>
  <ul class="catalog__list">
    <ProductItem v-for="product in products" :key="product.id" :product="product" :current-color-filter="currentColorFilter" />
  </ul>
</template>

<script>
import ProductItem from './ProductItem.vue';

export default {
  components: { ProductItem },
  props: ['products', 'currentColorFilter'],
};

</script>
