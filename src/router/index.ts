import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/nodes",
    name: "Nodes",
    component: () => import("../views/Nodes.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginPage.vue")
  },
  {
    path: "/operations",
    name: "Operations",
    component: () => import("../views/Operations.vue")
  },{
    path: "*",
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
