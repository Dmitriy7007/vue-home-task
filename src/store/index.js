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

    orderInfo: null,

    cartLoading: false,
    cartLoadingFailed: false,

    // formError: null,
    // formErrorMessage: null,

    orderId: null,

    orderLoading: false,
    orderLoadingFailed: false,

    orderSending: false,
    orderInfoBlock: [],
  },

  mutations: {
    updateOrderInfoBlock(state) {
      state.orderInfoBlock = [...state.cartProductsData].map((item) => ({
        ...item,
        amount: item.quantity,
      }));
    },

    updateOrderSending(state, status) {
      state.orderSending = status;
    },

    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },

    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
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
    updateOrderLoading(state, status) {
      state.orderLoading = status;
    },
    updateOrderLoadingFailed(state, status) {
      state.orderLoadingFailed = status;
    },
    // updateFormError(state, error) {
    //   state.formError = error;
    // },
    // updateFormErrorMessage(state, message) {
    //   state.formErrorMessage = message;
    // },
    updateOrderId(state, id) {
      state.orderId = id;
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
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    amountItem(state, getters) {
      return getters.cartDetailProducts.length;
    },
    orderTotalPrice(state) {
      return state.orderInfoBlock.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    orderAmountItem(state) {
      return state.orderInfoBlock.length;
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      context.commit('updateOrderLoading', true);
      context.commit('updateOrderLoadingFailed', false);
      return axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        })
        .catch(() => context.commit('updateOrderLoadingFailed', true))
        .then(() => context.commit('updateOrderLoading', false));
    },
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
    loadOrder(context, dataForm) {
      context.commit('updateOrderSending', true);

      return axios.post(`${API_BASE_URL}/api/orders`, {
        ...dataForm,
      }, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          context.commit('updateOrderInfoBlock');
          context.commit('resetCart');
          context.commit('updateOrderInfo', response.data);
          context.commit('updateOrderId', response.data.id);
          context.commit('updateOrderSending', false);
        });
    },
  },
});
