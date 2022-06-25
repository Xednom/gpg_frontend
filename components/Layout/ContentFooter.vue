<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="copyright">
        <!-- Messenger Chat plugin Code -->
    <div id="fb-root"></div>

    <!-- Your Chat plugin code -->
    <div id="fb-customer-chat" class="fb-customerchat"></div>
        &copy; Powered by GPG corporation, Psalms Global, Landmaster, Call.Me {{ year }}, made with <i class="tim-icons icon-heart-2"></i>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  },
  methods: {
    loadFbChat() {
      window.fbAsyncInit = function() {
        FB.init({
          xfbml: true,
          version: "v14.0",
        });
      };

      (function(d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    },
  },
  mounted() {
    var chatbox = document.getElementById("fb-customer-chat");
    chatbox.setAttribute("page_id", "103631948154984");
    chatbox.setAttribute("attribution", "biz_inbox");
    this.loadFbChat();
  }
};
</script>
<style></style>
