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

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
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
      const words = ['товар', 'товара', 'товаров'];
      const num = this.amountItem % 10;
      if (this.amountItem > 10 && this.amountItem < 20) return words[2];
      if (num > 1 && num < 5) return words[1];
      if (num === 1) return words[0];
      return words[2];
    },
  },
  methods: {
    cartLoad() {
      this.$store.dispatch('loadCart');
    },
  },
};
</script>
