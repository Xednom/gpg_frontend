<template>
  <div class="col-md-12">
    <div id="comment-section">
      <div class="col-md-12">
        <div class="form-row">
          <base-table
            :data="items"
            thead-classes="text-primary"
          >
            <template slot-scope="{ row }">
              <td class="client-comment" v-if="row.user_type != 'staff'">
                <p class="title">{{ row.commenter }}</p>
                <p class="text-muted comment">{{ row.comment }}</p>
                <p class="text-muted comment">
                  commented at {{ row.created_at }}
                </p>
              </td>
              <td class="staff-comment" v-else-if="row.user_type == 'staff'">
                <p class="title">{{ row.commenter }}</p>
                <p class="text-muted comment">{{ row.comment }}</p>
                <p class="text-muted comment">
                  commented at {{ row.created_at }}
                </p>
              </td>
            </template>
          </base-table>
        </div>
      </div>
    </div>
    <form class="mt-5" @submit.prevent="save">
      <base-alert v-if="error" type="danger" dismissible>
        <span>
          {{ errorMessage(error) }}
        </span>
      </base-alert>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <b-form-textarea
            class="form-control"
            placeholder="Comment"
            v-model="comment"
            rows="5"
            max-rows="15"
            required
          >
          </b-form-textarea>
        </div>
      </div>

      <div slot="footer">
        <div class="pull-right">
          <base-button
            v-if="!loading"
            native-type="submit"
            slot="footer"
            type="submit"
            round
            block
            size="lg"
          >
            Post
          </base-button>
          <base-button
            v-else
            native-type="submit"
            slot="footer"
            type="primary"
            round
            block
            size="lg"
            disabled
          >
            Posting...
          </base-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CreateJobCategoryMixin from "@/mixins/CreateJobOrderCategoryMixin.js";
import { DatePicker, Select } from "element-ui";
import { BaseAlert } from "@/components";
import { BaseTable } from "@/components";

export default {
  components: {
    BaseTable,
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
  },
  mixins: [CreateJobCategoryMixin],
  props: {
    staff: {
      type: Object,
      decription: "Staff data",
    },
    client: {
      type: Object,
      description: "Client data",
    },
    fetch: {
      type: Function,
    },
    items: {
      type: Array,
      default: () => []
    },
    item: {
        type: Object,
        default: {}
    },
    url: String,
    store: {
        type: String
    }
  },
  data() {
    return {
      loading: false,
      saving: false,
      error: "",
      comment: ""
    };
  },
  methods: {
    ...mapActions("jobOrderCategory", ["reset", "saveJobOrderCategory"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async refresh(id) {
      await this.$store.dispatch(
        "jobOrderCategory/fetchJobOrderCategory",
        this.item.ticket_number
      );
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      this.saving = true;
      if (isValidForm) {
        if (
          this.$auth.user.designation_category == "new_client" ||
          this.$auth.user.designation_category == "current_client" ||
          this.$auth.user.designation_category == "affiliate_partner"
        ) {
          try {
            console.log(this.comment)
            await this.$axios
              .post(`/api/v1/${this.url}/${this.item.id}/comment/`, {
                comment: this.comment,
              })
              .then(() => {
                this.saving = false;
                this.success = true;
                this.comment = "";
                this.$emit("refresh", this.item);
                // this.refresh(this.item.id);
              });
          } catch (err) {
            console.error(err);
            this.saving = false;
            this.success = false;
            this.error = err;
            this.errorMessage(this.error);
          }
        } else {
          await this.$axios
            .post(`/api/v1/${this.url}/${this.item.id}/comment/`, {
              comment: this.comment,
            })
            .then(() => {
              this.saving = false;
              this.success = true;
              this.comment = "";
              this.fetch();
              // this.refresh(this.item.id);
            });
          this.reset();
          this.fetch();
        }
      }
    },
    errorMessage(error) {
      if (error.item) {
        return `${this.item}` + ": " + this.error.item;
      } else if (error.user) {
        return "User: " + this.error.user;
      } else if (error.comment) {
        return "Comment: " + this.error.comment;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    },
  },
  computed: {
    // comment: {
    //   get() {
    //     return this.$store.getters[ `${this.store}/comment`];
    //   },
    //   set(value) {
    //     this.setBasicStoreValue("comment", value);
    //   },
    // },
  },
};
</script>

<style scoped>
#comment-section {
  width: 100%;
  max-height: 500px;
  overflow: auto;
}
.modal-body {
  margin-top: 35px !important;
}
.comment {
  margin-left: 10px;
}
.client-comment {
 background-color: #C5E0B4;
}
.staff-comment {
  background-color: #fff2cc;
}
</style>
