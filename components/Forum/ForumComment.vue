<template>
  <div class="col-md-12">
    <div id="comment-section">
      <div class="col-md-12">
        <div class="form-row">
          <base-table
            :data="threadComment.thread_comments"
            thead-classes="text-primary"
          >
            <template slot-scope="{ row }">
              <td class="client-comment" v-if="row.user_type != 'staff'">
                <p class="title">{{ row.commenter }}</p>
                <p class="text-muted comment">{{ row.comment }}</p>
                <p class="text-muted comment">
                  commented at {{ row.created_at }}
                </p>
                <hr />
              </td>
              <td class="staff-comment" v-else-if="row.user_type == 'staff'">
                <p class="title">{{ row.commenter }}</p>
                <p class="text-muted comment">{{ row.comment }}</p>
                <p class="text-muted comment">
                  commented at {{ row.created_at }}
                </p>
                <hr />
              </td>
            </template>
          </base-table>
        </div>
      </div>
    </div>
    <form class="mt-5" @submit.prevent="save">
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
            v-if="!saving"
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
import ForumMixin from "@/mixins/ForumMixin.js";
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
  mixins: [ForumMixin],
  props: {
    fetch: {
      type: Function,
    },
    threadComment: {
      type: Object,

      description: "Thread object data",
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
    };
  },
  methods: {
    ...mapActions("forum", ["resetComment", "saveComment"]),
    async save() {
      this.saving = true;
      if (this.$auth.user.designation_category != "staff") {
        try {
          const payload = {
            id: this.threadComment.id,
            comment: this.comment,
          };
          await this.saveComment(payload);
          this.saving = false;
          this.resetComment();
          this.fetch();
        } catch (err) {
          this.saving = false;
          this.error = err;
          this.errorMessage("danger", this.error);
        }
      } else {
        try {
          const payload = {
            id: this.threadComment.id,
            comment: this.comment,
          };
          await this.saveComment(payload);
          this.saving = false;
          this.fetch();
          this.resetComment();
        } catch (e) {
          this.saving = false;
          this.errorMessage("danger", this.error);
        }
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.author
          ? "Author: " + error.author
          : error.thread
          ? "Thread: " + error.thread
          : error.comment
          ? "Comment: " + error.comment
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Error`,
          variant: variant,
          solid: true,
        }
      );
    },
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
  background-color: #c5e0b4;
}
.staff-comment {
  background-color: #fff2cc;
}
</style>
