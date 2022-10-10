/* eslint-disable max-len */
import products from '@/data/products';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [
      { productId: 1, amount: 3 },
    ],
  },
  mutations: {
    addProductToCart(state, { productId, amount }) {
      const item = state.cartProducts.find((product) => product.productId === productId);

      if (item) {
        item.amount += amount;
      } else {
        state.cartProducts.push({
          productId,
          amount,
        });
      }
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((product) => product.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.productId),
      }));
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    amountItem(state, getters) {
      return getters.cartDetailProducts.length;
    },
  },
});
