import { mapGetters } from "vuex";

export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("marketing/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
  },
  computed: {
    property_detail: {
      get() {
        return this.$store.getters["marketing/property_detail"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail", value);
      },
    },
    apn: {
      get() {
        return this.$store.getters["marketing/apn"];
      },
      set(value) {
        this.setBasicStoreValue("apn", value);
      },
    },
    client_code: {
      get() {
        return this.$store.getters["marketing/client_code"];
      },
      set(value) {
        this.setBasicStoreValue("client_code", value);
      },
    },
    description: {
      get() {
        return this.$store.getters["marketing/description"];
      },
      set(value) {
        this.setBasicStoreValue("description", value);
      },
    },
    description_of_request: {
      get() {
        return this.$store.getters["marketing/description_of_request"];
      },
      set(value) {
        this.setBasicStoreValue("description_of_request", value);
      },
    },
    completed_job_order_file: {
      get() {
        return this.$store.getters["marketing/completed_job_order_file"];
      },
      set(value) {
        this.setBasicStoreValue("completed_job_order_file", value);
      },
    },
    date_completed: {
      get() {
        return this.$store.getters["marketing/date_completed"];
      },
      set(value) {
        this.setBasicStoreValue("date_completed", value);
      },
    },
    status_of_job: {
      get() {
        return this.$store.getters["marketing/status_of_job"];
      },
      set(value) {
        this.setBasicStoreValue("status_of_job", value);
      },
    },
    images: {
      get() {
        return this.$store.getters["marketing/images"];
      },
      set(value) {
        this.setBasicStoreValue("images", value);
      },
    },
    ad_content: {
      get() {
        return this.$store.getters["marketing/ad_content"];
      },
      set(value) {
        this.setBasicStoreValue("ad_content", value);
      },
    },
    youtube_videos: {
      get() {
        return this.$store.getters["marketing/youtube_videos"];
      },
      set(value) {
        this.setBasicStoreValue("youtube_videos", value);
      },
    },
    tiktok_videos: {
      get() {
        return this.$store.getters["marketing/tiktok_videos"];
      },
      set(value) {
        this.setBasicStoreValue("tiktok_videos", value);
      },
    },
    email_campaign: {
      get() {
        return this.$store.getters["marketing/email_campaign"];
      },
      set(value) {
        this.setBasicStoreValue("email_campaign", value);
      },
    },
    other_graphics: {
      get() {
        return this.$store.getters["marketing/other_graphics"];
      },
      set(value) {
        this.setBasicStoreValue("other_graphics", value);
      },
    },
    other_makerting_files: {
      get() {
        return this.$store.getters["marketing/other_makerting_files"];
      },
      set(value) {
        this.setBasicStoreValue("other_makerting_files", value);
      },
    },
    neighbor_list: {
      get() {
        return this.$store.getters["marketing/neighbor_list"];
      },
      set(value) {
        this.setBasicStoreValue("neighbor_list", value);
      },
    },
    assigned_to: {
      get() {
        return this.$store.getters["marketing/assigned_to"];
      },
      set(value) {
        this.setBasicStoreValue("assigned_to", value);
      },
    },
    notes: {
      get() {
        return this.$store.getters["marketing/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      },
    },
  },
  mounted() {
    setTimeout(() => {
      this.id = this.item.id;
      this.apn = this.item.apn;
      this.client_code = this.item.client_code;
      this.description = this.item.description;
      this.notes = this.item.notes;
      this.description_of_request = this.item.description_of_request;
      this.completed_job_order_file = this.item.completed_job_order_file;
      this.date_completed = this.item.date_completed;
      this.status_of_job = this.item.status_of_job;
      this.images = this.item.images;
      this.ad_content = this.item.ad_content;
      this.youtube_videos = this.item.youtube_videos;
      this.tiktok_videos = this.item.tiktok_videos;
      this.email_campaign = this.item.email_campaign;
      this.other_graphics = this.item.other_graphics;
      this.other_makerting_files = this.item.other_makerting_files;
      this.neighbor_list = this.item.neighbor_list;
      this.assigned_to = this.item.assigned_to;
    }, 500);
  },
};
