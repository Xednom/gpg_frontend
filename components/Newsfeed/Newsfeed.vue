<template>
  <div class="content">
    <div class="container mt-5">
      <div class="row">
        <div class="col-sm-12" v-if="!newsFeeds.length">
          <card card-body-classes="table-full-width">
            <h1 slot="header" class="card-title text-center">No news yet.</h1>
          </card>
        </div>
        <div class="col-sm-12" v-else>
          <card
            card-body-classes="table-full-width"
            v-for="(newsFeed, index) in newsFeeds"
            :key="index"
          >
            <h1 slot="header" class="card-title">{{ newsFeed.title }}</h1>
            <div>
              <p v-html="newsFeed.body"></p>
            </div>
            <hr />
            <nuxt-link :to="'/newsfeed/' + newsFeed.id"
              ><b-button class="btn-view-comment"
                >View comments</b-button
              ></nuxt-link
            >

            <div>
              <b-modal
                size="lg"
                id="comment-section"
                hide-footer
                :title="newsFeed.title + ' comment section'"
              >
                <form @submit.prevent="save">
                  <base-alert v-if="error" type="danger" dismissible>
                    <span>
                      {{ errorMessage(error) }}
                    </span>
                  </base-alert>
                  <b-form-textarea
                    class="form-control comment-text-section mb-3"
                    placeholder="Comment"
                    v-model="comment"
                    rows="1"
                    max-rows="10"
                    required
                  >
                  </b-form-textarea>
                  <div slot="footer">
                    <div class="pull-right">
                      <base-button
                        v-if="!loading"
                        native-type="submit"
                        slot="footer"
                        type="submit"
                        round
                        block
                        size="sm"
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
                        size="sm"
                        disabled
                      >
                        Posting...
                      </base-button>
                    </div>
                  </div>
                </form>
                <card
                  class="comment-card"
                  v-for="(comments, index) in newsFeed.news_feed_comments"
                  :key="index"
                >
                  <h4 slot="header" class="card-title">
                    <strong>{{ comments.commenter }}</strong>
                  </h4>
                  <p>
                    {{ comments.comment }}
                  </p>
                </card>
              </b-modal>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "newsfeeds",
  data() {
    return {
      loading: false,
      // newsFeed: {},
      next: null,
      comment: "",
      modals: {
        comments: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      newsFeeds: "newsfeed/newsFeeds",
      newsFeed: "newsfeed/newsFeed",
      pagination: "newsfeed/newsFeedsPagination",
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser",
    }),
  },
  methods: {
    async fetchNewsFeeds() {
      this.isBusy = true;
      await this.$store
        .dispatch("newsfeed/fetchNewsFeeds", this.pagination)
        .then(() => {
          // this.newsFeeds.forEach((item) => {
          //   this.newsFeed = item;
          // });
          this.isBusy = false;
        });
    },
    async fetchNewsFeed(id) {
      await this.$store.dispatch("newsfeed/fetchNewsFeed", id).then(() => {
        console.log(this.newsFeed.id);
      });
    },
    async save() {
      console.log();
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        if (
          this.$auth.user.designation_category == "new_client" ||
          this.$auth.user.designation_category == "current_client" ||
          this.$auth.user.designation_category == "affiliate_partner"
        ) {
          try {
            await this.$axios
              .post(`/api/v1/newsfeed/${this.newsFeed.id}/comment/`, {
                comment: this.comment,
              })
              .then(() => {
                this.loading = false;
                this.success = true;
                this.comment = "";
                this.fetchNewsFeeds();
              });
          } catch (err) {
            console.log(err);
            this.success = false;
            this.error = err;
            this.errorMessage(this.error);
          }
        } else {
          const payload = {
            job_order_comments: {
              newsfeed: this.newsFeed.id,
              user: this.$auth.user.id,
              comment: this.comment,
            },
          };
          await this.$axios
            .post(`/api/v1/newsfeed/${this.newsFeed.id}/comment/`, {
              comment: this.comment,
            })
            .then(() => {
              this.loading = false;
              this.success = true;
              this.comment = "";
              this.fetchNewsFeeds();
            });
          this.fetchNewsFeeds();
        }
      }
    },
    errorMessage(error) {
      if (error.newsfeed) {
        return "newsfeed: " + this.error.newsfeed;
      } else if (error.user) {
        return "User: " + this.error.user;
      } else if (error.comment) {
        return "Comment: " + this.error.comment;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    },
  },
  async mounted() {
    await this.fetchNewsFeeds();
    // this.fetchNewsFeed();
  },
};
</script>

<style scoped>
.comment-card {
  background-color: rgb(236, 236, 236) !important;
}
.comment-text-section {
  background-color: #eeeeee;
  border-radius: 5px;
}
.btn-view-comment {
  border-radius: 0px;
}
</style>
