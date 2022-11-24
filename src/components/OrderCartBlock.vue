<!-- eslint-disable vue/no-deprecated-filter -->
<!-- eslint-disable max-len -->
<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <OrderCartItem v-for="item in products" :key="item.productId" :item="item"/>
    </ul>

    <div class="cart__total">
      <p>Доставка: <b>500 ₽</b></p>
      <p>Итого: <b>{{amountItem}}</b> {{productWord}} на сумму <b>{{ totalPrice + 500 | numberFormat }} ₽</b></p>
    </div>

    <button class="cart__button button button--primery" type="submit" style="position: relative">
      <span style="position: absolute; top: calc(50% - 15px); left: 25px;" v-show="$store.state.orderSending">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="30px" height="30px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#fff" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
        </circle>
        </svg>
      </span>
        Оформить заказ
    </button>
  </div>
</template>

<script>
import OrderCartItem from '@/components/OrderCartItem.vue';
import { mapGetters } from 'vuex';
import productWord from '@/helpers/productWord';
import numberFormat from '@/helpers/numberFormat';

export default {
  filters: {
    numberFormat,
  },
  components: { OrderCartItem },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', amountItem: 'amountItem' }),
    productWord() {
      return productWord(this.amountItem);
    },
  },
};
</script>
