<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>
    <sidebar-fixed-toggle-button />

    <div v-if="$auth.user.designation_category == 'new_client' ||
      $auth.user.designation_category == 'current_client' ||
      $auth.user.designation_category == 'affiliate_partner'">
      <side-bar
        :background-color="sidebarBackground"
        :short-title="$t('sidebar.shortTitle')"
        :title="$t('sidebar.title')"
      >
        <template slot-scope="props" slot="links">
          <!-- TODO: uncomment this if the necessary features are integrated already -->
          <sidebar-item
            :link="{
              name: $t('sidebar.dashboard'),
              icon: 'tim-icons icon-chart-pie-36',
              path: '/',
            }"
          >
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Job order',
              icon: 'tim-icons icon-bullet-list-67',
              path: '/',
            }"
          >
            <sidebar-item
              :link="{
                name: 'Per APN Job Order',
                path: '/job-order/category',
              }"
            ></sidebar-item>
            <sidebar-item
              :link="{
                name: 'General Request',
                path: '/job-order/general',
              }"
            ></sidebar-item>
            <sidebar-item
              :link="{
                name: 'APN Inventory',
                path: '/job-order/property-detail',
              }"
            ></sidebar-item>
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Timesheet',
              icon: 'tim-icons icon-watch-time',
              path: '/',
            }"
          >
            <sidebar-item
              :link="{
                name: 'Account Balance',
                path: '/timesheet/account-balance',
              }"
            ></sidebar-item>
            <sidebar-item
              :link="{
                name: 'Account Charges',
                path: '/timesheet/account-charge',
              }"
            ></sidebar-item>
            <sidebar-item
              :link="{
                name: 'Payment History',
                path: '/timesheet/payment-history',
              }"
            ></sidebar-item>
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Due diligence',
              icon: 'tim-icons icon-bullet-list-67',
              path: '/',
            }"
          >
            <sidebar-item
              :link="{
                name: 'Call out dashboard',
                path: '/due-diligence/call-out'
              }"
            ></sidebar-item>
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Account credentials',
              icon: 'tim-icons icon-single-02',
              path: '/login-credentials/',
            }"
          >
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Account Files',
              icon: 'tim-icons icon-paper',
              path: '/account-files/',
            }"
          >
          </sidebar-item>
        </template>
      </side-bar>
    </div>
    <div v-else>
      <side-bar
        :background-color="sidebarBackground"
        :short-title="$t('sidebar.shortTitle')"
        :title="$t('sidebar.title')"
      >
        <template slot-scope="props" slot="links">
          <!-- TODO: uncomment this if the necessary features are integrated already -->
          <sidebar-item
            :link="{
              name: $t('sidebar.dashboard'),
              icon: 'tim-icons icon-chart-pie-36',
              path: '/',
            }"
          >
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Job order',
              icon: 'tim-icons icon-bullet-list-67',
              path: '/',
            }"
          >
            <sidebar-item
              :link="{
                name: 'Per APN Job Order',
                path: '/job-order/category',
              }"
            ></sidebar-item>
            <sidebar-item
              :link="{
                name: 'General Request',
                path: '/job-order/general',
              }"
            ></sidebar-item>
            <sidebar-item
              :link="{
                name: 'APN Inventory',
                path: '/job-order/property-detail',
              }"
            ></sidebar-item>
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Timesheet',
              icon: 'tim-icons icon-watch-time',
              path: '/',
            }"
          >
            <sidebar-item
              :link="{
                name: 'Account Charges',
                path: '/timesheet/account-charge',
              }"
            ></sidebar-item>
            <sidebar-item
              :link="{
                name: 'Account Balance',
                path: '/timesheet/staff-account-balance',
              }"
            ></sidebar-item>
            <sidebar-item
              :link="{
                name: 'Payment History',
                path: '/timesheet/staff-payment-history',
              }"
            ></sidebar-item>
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Due diligence',
              icon: 'tim-icons icon-bullet-list-67',
              path: '/',
            }"
          >
            <sidebar-item
              :link="{
                name: 'Call out dashboard',
                path: '/due-diligence/call-out'
              }"
            ></sidebar-item>
            <sidebar-item
              :link="{
                name: 'Phone line extension',
                path: '/due-diligence/phone-line-extension',
              }"
            ></sidebar-item>
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Account credentials',
              icon: 'tim-icons icon-single-02',
              path: '/login-credentials/',
            }"
          >
          </sidebar-item>
          <sidebar-item
            :link="{
              name: 'Account Files',
              icon: 'tim-icons icon-paper',
              path: '/account-files/',
            }"
          >
          </sidebar-item>
        </template>
      </side-bar>
    </div>
    <!--Share plugin (for demo purposes). You can remove it if don't plan on using it-->
    <sidebar-share :background-color.sync="sidebarBackground"> </sidebar-share>
    <div class="main-panel" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <router-view name="header"></router-view>

      <div :class="{ content: !isFullScreenRoute }" @click="toggleSidebar">
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <nuxt></nuxt>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!isFullScreenRoute"></content-footer>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import SidebarShare from "@/components/Layout/SidebarSharePlugin";
function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import DashboardNavbar from "@/components/Layout/DashboardNavbar.vue";
import ContentFooter from "@/components/Layout/ContentFooter.vue";
import DashboardContent from "@/components/Layout/Content.vue";
import SidebarFixedToggleButton from "@/components/Layout/SidebarFixedToggleButton.vue";
import { SlideYDownTransition, ZoomCenterTransition } from "vue2-transitions";

export default {
  middleware: ["auth"],
  components: {
    DashboardNavbar,
    ContentFooter,
    SidebarFixedToggleButton,
    DashboardContent,
    SlideYDownTransition,
    ZoomCenterTransition,
    SidebarShare,
  },
  data() {
    return {
      sidebarBackground: "vue", //vue|blue|orange|green|red|primary
    };
  },
  computed: {
    isFullScreenRoute() {
      return this.$route.path === "/maps/full-screen";
    },
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    initScrollbar() {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar("sidebar");
        initScrollbar("main-panel");
        initScrollbar("sidebar-wrapper");

        docClasses.add("perfect-scrollbar-on");
      } else {
        docClasses.add("perfect-scrollbar-off");
      }
    },
  },
  mounted() {
    this.initScrollbar();
  },
};
</script>
<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}

.main-panel .zoomIn {
  animation-name: zoomIn95;
}

@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-panel .zoomOut {
  animation-name: zoomOut95;
}
</style>
