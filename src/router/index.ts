import {createRouter, createWebHistory} from 'vue-router';
import FileJavascript from '../views/javascript/index.vue'; 
import FileVue from '../views/vue/index.vue'; 

const routes = [
  {path: '/javascript', component: FileJavascript},
  {path: '/vue', component: FileVue}
];

export const router = createRouter({
    // 4. Provide the history implementation to use. We
    // are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
  })
  //createWebHistory : giúp ta tạo ra lịch sử cho thằng chorme giúp có thể quay lại trang web trước đó