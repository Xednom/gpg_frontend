<template>
  <base-nav
    v-model="showMenu"
    class="navbar-absolute top-navbar"
    type="white"
    :transparent="true"
  >
    <div slot="brand" class="navbar-wrapper">
      <div class="navbar-minimize d-inline"><sidebar-toggle-button /></div>
      <div
        class="navbar-toggle d-inline"
        :class="{ toggled: $sidebar.showSidebar }"
      >
        <button type="button" class="navbar-toggler" @click="toggleSidebar">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </button>
      </div>
      <a class="navbar-brand" href="#">{{ routeName }}</a>
    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
      <li class="current-user">
        <div class="text-center">
          <nuxt-link :to="'/notification/'"
            >
            <i class="tim-icons icon-bell-55" v-b-tooltip.hover.bottom="'You have ' + unread + ' notifications'"></i>
            <b-badge variant="danger" v-if="unread > 0">{{ unread }}</b-badge></nuxt-link
          >
        </div>
        <template slot="title">
          <div
            class="notification d-none d-lg-block d-xl-block"
            v-if="unread != 0"
          ></div>
          <i
            class="tim-icons icon-bell-55"
            @click="fetchUnread"
            v-b-tooltip.hover.bottom="'You have ' + unread + ' notifications'"
          ></i>
        </template>
      </li>
      <li class="current-user">
        <span>
          {{ this.$auth.user.first_name }} {{ this.$auth.user.last_name }}
        </span>
      </li>

      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        class="nav-item"
        title-classes="nav-link"
        menu-classes="dropdown-navbar"
      >
        <template slot="title">
          <div class="photo"></div>
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <p class="d-lg-none">Log out</p>
        </template>
        <li class="nav-link">
          <nuxt-link class="nav-item dropdown-item" to="/pages/user"
            >Profile</nuxt-link
          >
        </li>
        <div class="dropdown-divider"></div>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item" @click="logout">Log out</a>
        </li>
      </base-dropdown>
    </ul>
  </base-nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { BaseNav, Modal } from "@/components";
import SidebarToggleButton from "./SidebarToggleButton";

import { debounce } from "lodash";

export default {
  components: {
    SidebarToggleButton,
    CollapseTransition,
    BaseNav,
    Modal,
  },
  computed: {
    routeName() {
      const { path } = this.$route;
      let parts = path.split("/");
      return parts.map((p) => this.capitalizeFirstLetter(p)).join(" ");
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: "",
      notifications: [],
      loading: false,
      unread: 0,
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      if (!string || typeof string !== "string") {
        return "";
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    async logout() {
      await this.$auth.logout().then((res) => {
        this.$router.push("/login");
      });
    },
    async fetchUnread() {
      this.loading = true;
      let endpoint = `/api/v1/alerts/`;
      let response = await this.$axios.get(endpoint);
      if (response.status == 200) {
        this.unread = response.data.count;
      }
    },
  },
  created() {
    this.fetchUnread();
  },
  mounted() {
    this.$root.$on('fetchUnread', () => {
      this.fetchUnread();
    })
  }
};
</script>
<style scoped>
.top-navbar {
  top: 0px;
}
.navbar-nav .current-user {
  padding-top: 10px !important;
}
</style>
