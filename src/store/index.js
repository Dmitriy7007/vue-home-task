/* eslint-disable consistent-return */
/* eslint-disable max-len */
// import products from '@/data/products';
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],

    userAccessKey: null,

    cartProductsData: [],

    cartLoading: false,
    cartLoadingFailed: false,

  },
  mutations: {
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((product) => product.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    updateCartLoading(state, status) {
      state.cartLoading = status;
    },
    updateCartLoadingFailed(state, status) {
      state.cartLoadingFailed = status;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData
        .map((item) => ({
          productId: item.product.id,
          amount: item.quantity,
        }));
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);

        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
      // return state.cartProducts.map((item) => ({
      //   ...item,
      //   product: products.find((p) => p.id === item.productId),
      // }));
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    amountItem(state, getters) {
      return getters.cartDetailProducts.length;
    },
  },
  actions: {
    loadCart(context) {
      context.commit('updateCartLoading', true);
      context.commit('updateCartLoadingFailed', false);
      return axios.get(`${API_BASE_URL}/api/baskets`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .catch(() => context.commit('updateCartLoadingFailed', true))
        .then(() => context.commit('updateCartLoading', false));
    },
    addProductToCart(context, { productId, amount }) {
      // eslint-disable-next-line no-promise-executor-return
      return (new Promise((resolve) => setTimeout(resolve, 0)))
        .then(() => axios
          .post(`${API_BASE_URL}/api/baskets/products`, {
            productId,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((response) => {
            context.commit('updateCartProductsData', response.data.items);
            context.commit('syncCartProducts');
          }));
    },
    updateCartProductAmount(context, { productId, amount }) {
      context.commit('updateCartProductAmount', { productId, amount });

      if (amount < 1) { return; }

      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
    deleteCartProduct(context, productId) {
      context.commit('deleteCartProduct', productId);

      return axios
        .delete(`${API_BASE_URL}/api/baskets/products?userAccessKey=${context.state.userAccessKey}`, {
          data: { productId },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
  },
});
