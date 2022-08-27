import { createApp } from 'vue';
import App from './App.vue';
import getMessage from './data/data_2';
import { data1, data2 } from './data/data_1';

getMessage(data1);
getMessage(data2);

createApp(App).mount('#app');
