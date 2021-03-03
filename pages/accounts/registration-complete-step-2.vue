<template>
  <reg-complete-second></reg-complete-second>
</template>

<script>
import RegCompleteSecond from "@/components/Accounts/RegistrationCompleteSecond.vue";
export default {
  auth: false,
  layout: "auth",
  name: "RegistrationComplete",
  components: {
    RegCompleteSecond,
  },
};
</script>
