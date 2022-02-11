<template>
  <div class="content container">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <h4 slot="header" class="card-title">Notifications</h4>
          <div>
            <b-container fluid>
              <b-col sm="12" md="6" class="my-1 pull-left">
                <p>
                  <b-button size="sm" @click="selectAllRows">Select all</b-button>
                  <b-button size="sm" @click="clearSelected">Clear selected</b-button>
                  <b-button size="sm" @click="unread">Mark as read</b-button>
                </p>
              </b-col>
              <!-- Main table element -->
              <b-table
                :items="notifications"
                :fields="computedFields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :busy="isBusy"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                :select-mode="selectMode"
                selectable
                hover
                ref="selectableTable"
                stacked="md"
                show-empty
                small
                @filtered="onFiltered"
                @row-selected="onRowSelected"
              >
                <template #table-busy>
                  <div class="text-center text-default my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>

                <template #cell(selected)="{ rowSelected }">
                  <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                  </template>
                </template>

                <template #cell(actor)="row">
                  <div v-if="row.item.staff">
                    <div v-if="row.item.job_order == 'general'">
                      <nuxt-link
                        :to="
                          '/job-order/general/' + row.item.target.ticket_number
                        "
                        >{{ row.item.staff }} updated the Job order General ticket #{{ row.item.target.ticket_number }}</nuxt-link
                      >
                    </div>
                    <div v-else-if="row.item.job_order == 'category'">
                      <nuxt-link
                        :to="
                          '/job-order/category/' + row.item.target.ticket_number
                        "
                        >{{ row.item.staff }} updated the Job order request by APN ticket #{{ row.item.target.ticket_number }}</nuxt-link
                      >
                    </div>
                  </div>
                  <div v-else-if="row.item.client">
                    <nuxt-link
                      :to="
                        '/job-order/general/' + row.item.target.ticket_number
                      "
                      >{{ row.item.client }} updated the job order ticket #
                      {{ row.item.target.ticket_number }}</nuxt-link
                    >
                  </div>
                </template>
                <template #cell(client_code)="row">
                  <template v-if="$auth.user.designation_category == 'staff'">
                    {{ row.item.client_code }}
                  </template>
                  <template v-else>
                    <nuxt-link :to="'/login-credentials/' + row.item.id">{{
                      row.item.client_code
                    }}</nuxt-link>
                  </template>
                </template>

                <template #cell(actions)="row">
                  <b-button
                    size="sm"
                    @click="
                      {
                        fetchAccount(row.item.id), (modals.info = true);
                      }
                    "
                    class="mr-1"
                  >
                    Info
                  </b-button>
                </template>
              </b-table>
            </b-container>
          </div>
          <div
            slot="footer"
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <div class="">
              <p class="card-category"></p>
            </div>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { Modal } from "@/components";
import swal from "sweetalert2";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "paginated",
  components: {
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    ...mapGetters({
      notifications: "notifications/notifications",
      clientUser: "user/clientUser",
      pagination: "notifications/notificationsPagination",
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser",
    }),
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    computedFields() {
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        return this.fields.filter((field) => !field.requiresStaff);
      } else {
        return this.fields.filter((field) => !field.requiresClient);
      }
    },
  },
  data() {
    return {
      searchQuery: "",
      searchedData: [],
      selected: [],
      account: {},
      fuseSearch: null,
      isBusy: false,
      selectMode: "multi",
      error: {
        client: "",
        staff: "",
        category: "",
        url: "",
        username: "",
        password: "",
        notes: "",
      },
      fields: [
        {key: "selected"},
        { key: "actor", label: "" },
        // { key: "target.ticket_number", label: "ticket number", sortable: true },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 100,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      modals: {
        create: false,
        info: false,
      },
    };
  },
  methods: {
    ...mapActions("notifications", ["fetchUnread"]),
    onRowSelected(items) {
      this.selected = items;
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected()
    },
    async fetchNotifications() {
      this.isBusy = true;
      await this.$store
        .dispatch("notifications/fetchNotifications", this.pagination)
        .then(() => {
          this.totalRows = this.notifications.length;
          this.$root.$emit('fetchUnread');
          this.isBusy = false;
        });
    },
    
    async unread() {
      try {
        this.selected.forEach((item) => {
            let url = `/api/v1/alerts/${item.id}/`;
            this.$axios.put(url).then(() => {
              this.fetchNotifications();
              this.$root.$emit('fetchUnread');
              this.fetchUnread();
            });
        })
      } catch (e) {
        throw e;
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
          : error.category
          ? "Category: " + errors.category
          : errors.url
          ? "Url" + error.url
          : error.username
          ? "Username: " + error.username
          : error.password
          ? "Password: " + error.password
          : error.notes
          ? "Notes: " + error.notes
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Something went wrong`,
          variant: variant,
          solid: true,
        }
      );
    },
  },
  async mounted() {
    await this.fetchNotifications();
  },
};
</script>
<style scoped>
.pagination-select,
.search-input {
  width: 200px;
}
#job-order-comments .modal-dialog {
  transform: none !important;
}
.page-number {
  color: black !important;
  background-color: white !important;
}
</style>
