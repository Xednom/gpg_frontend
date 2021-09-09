<template>
  <div>
    <base-nav
      v-model="showMenu"
      type="white"
      :transparent="true"
      menu-classes="justify-content-end"
      class="auth-navbar fixed-top"
    >
      <div slot="brand" class="navbar-wrapper brand-logo">
        <img src="~/static/img/landmaster_a.png" alt="Logo white" />
      </div>

      <ul class="navbar-nav">
        <nuxt-link class="nav-item" tag="li" to="/register">
          <a class="nav-link" style="color: white;">
            <i class="tim-icons icon-laptop" style="color: white;"></i> Register
          </a>
        </nuxt-link>

        <nuxt-link class="nav-item" tag="li" to="/login">
          <a class="nav-link" style="color: white;">
            <i class="tim-icons icon-single-02" style="color: white;"></i> Login
          </a>
        </nuxt-link>
      </ul>
    </base-nav>
    <div class="wrapper wrapper-full-page">
      <div class="full-page" :class="pageClass">
        <div class="content content-login">
          <div class="content header py-7 py-lg-8 pt-lg-9">
            <zoom-center-transition
              :duration="pageTransitionDuration"
              mode="out-in"
            >
              <nuxt></nuxt>
            </zoom-center-transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BaseNav } from "@/components";
import { ZoomCenterTransition } from "vue2-transitions";

export default {
  components: {
    BaseNav,
    ZoomCenterTransition,
  },
  props: {
    backgroundColor: {
      type: String,
      default: "black",
    },
  },
  data() {
    return {
      showMenu: false,
      menuTransitionDuration: 250,
      pageTransitionDuration: 200,
      year: new Date().getFullYear(),
      pageClass: "login-page",
    };
  },
  computed: {
    title() {
      let parts = this.$route.path.split("/");
      let name = parts[parts.length - 1];
      return `${name} Page`;
    },
  },
  methods: {
    closeMenu() {
      document.body.classList.remove("nav-open");
      this.showMenu = false;
    },
  },
  beforeDestroy() {
    this.closeMenu();
  },
  beforeRouteUpdate(to, from, next) {
    // Close the mobile menu first then transition to next page
    if (this.showMenu) {
      this.closeMenu();
      setTimeout(() => {
        next();
      }, this.menuTransitionDuration);
    } else {
      next();
    }
  },
};
</script>
<style lang="scss">
.content-login {
  height: 150px !important;
  background-image: linear-gradient(87deg, #fff, #f80404) !important;
  background-repeat: no-repeat !important;
}
.content-bottom {
  background-image: linear-gradient(87deg, #fff, #fff) !important;
  background-repeat: no-repeat !important;
}
.brand-logo {
  width: 12% !important;
}
.navbar.auth-navbar {
  top: 0;
  position: absolute !important;
}

$scaleSize: 0.8;
@keyframes zoomIn8 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  100% {
    opacity: 1;
  }
}

.wrapper-full-page .zoomIn {
  animation-name: zoomIn8;
}

@keyframes zoomOut8 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.wrapper-full-page .zoomOut {
  animation-name: zoomOut8;
}
</style>
