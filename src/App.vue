<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <section class="catalog">
    <ProductList :products="products"/>
    <BasePagination :page.sync="page" :count="countProducts" :per-page="productsPerPage" />
  </section>
</template>

<script>
import products from './data/products';
import ProductList from './components/ProductList.vue';
import BasePagination from './components/BasePagination.vue';

export default {
  name: 'App',
  components: { ProductList, BasePagination },
  data() {
    return {
      productsPerPage: 3,
      page: 1,
    };
  },
  computed: {
    products() {
      const offset = (this.page - 1) * this.productsPerPage;
      return products.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      return products.length;
    },
  },

};
</script>
