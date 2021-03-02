<template>
<forgot-password></forgot-password>
</template>

<script>
import ForgotPassword from "@/components/Accounts/ForgotPassword.vue";
export default {
    auth: false,
    layout: "auth",
    components: {
        ForgotPassword
    }
}
</script>