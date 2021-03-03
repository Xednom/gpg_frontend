<template>
  <reg-complete-first></reg-complete-first>
</template>

<script>
import RegCompleteFirst from "@/components/Accounts/RegistrationComplete.vue";
export default {
  auth: false,
  layout: "auth",
  name: "RegistrationComplete",
  components: {
    RegCompleteFirst,
  },
};
</script>
