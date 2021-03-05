<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="copyright">
        &copy; GPG Corporation {{ year }}, made with <i class="tim-icons icon-heart-2"></i> by
        <a href="https://psalmsglobal.com/" rel="noopener" target="_blank">Psalms Global</a>
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
  }
};
</script>
<style></style>
