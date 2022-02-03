<template>
    <lead-info></lead-info>
</template>

<script>
import LeadInfo from "@/components/UserProfile/AddLeadInfo.vue";
export default {
    auth: true,
    layout: "auth",
    components: {
        LeadInfo
    }
}
</script>