<!-- eslint-disable vue/no-deprecated-router-link-tag-prop -->
<!-- eslint-disable vue/no-deprecated-filter -->
<!-- eslint-disable max-len -->
<template>
  <main class="content container" v-if="$store.state.cartLoading">Загрузка корзины...</main>
  <main class="content container" v-else-if="$store.state.cartLoadingFailed">Не удалось загрузить корзину товаров<br>
    <button @click.prevent="cartLoad">Попробовать еще раз</button>
  </main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ amountItem }} {{ productWord }}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.productId" :item="item"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice | numberFormat }} ₽</span>
          </p>

          <router-link tag="button" :to="{name: 'order'}" class="cart__button button button--primery" type="submit" v-if="productAvailability">
            Оформить заказ
          </router-link>
          <router-link tag="button" :to="{name: 'order'}" class="cart__button button button--primery" v-else disabled>
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import productWord from '@/helpers/productWord';
import { mapGetters } from 'vuex';
import CartItem from '@/components/CartItem.vue';

export default {
  filters: {
    numberFormat,
  },
  components: { CartItem },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', amountItem: 'amountItem' }),

    productWord() {
      return productWord(this.amountItem);
    },
    productAvailability() {
      return this.$store.state.cartProducts.length > 0;
    },
  },
  methods: {
    cartLoad() {
      this.$store.dispatch('loadCart');
    },
  },
};
</script>
