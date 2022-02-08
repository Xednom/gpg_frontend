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
      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        title-classes="nav-link"
        class="nav-item"
      >
        <template slot="title">
          <div class="notification d-none d-lg-block d-xl-block"></div>
          <i class="tim-icons icon-bell-55"></i>
          <p class="d-lg-none">New Notifications</p>
        </template>
        <li
          class="nav-link"
          v-for="(notif, index) in notifications"
          :key="index"
        >
          <div v-if="notif.staff">
            <a :href="'/job-order/general/' + notif.target.ticket_number" class="nav-item dropdown-item"
              >{{ notif.staff }} {{ notif.verb }} the job order {{ notif.target.ticket_number }} in {{ notif.timestamp }}</a
            >
          </div>
          <div v-else-if="notif.client">
            <a :href="'/job-order/general/' + notif.target.ticket_number" class="nav-item dropdown-item"
              >{{ notif.client }} {{ notif.verb }} the job order {{ notif.target.ticket_number }} in {{ notif.timestamp }}</a
            >
          </div>
        </li>
      </base-dropdown>
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
    async fetchNotifications() {
      let endpoint = `/api/v1/alerts/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.notifications = res.data.results;
        })
        .catch((e) => {
          throw e;
        });
    },
  },
  created() {
    this.fetchNotifications();
    // this.interval = setInterval(() => this.fetchNotifications(), 5000);
  },
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
