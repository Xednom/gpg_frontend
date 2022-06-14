<template>
  <div class="container content">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div>
            <b-container fluid>
              <!-- <b-row> -->
              <b-col sm="12" md="4" class="my-1 pull-left">
                <nuxt-link :to="'/forums/create'"
                  ><b-button class="create-button" variant="success"
                    >Create a Thread</b-button
                  ></nuxt-link
                >
              </b-col>

              <b-col sm="12" md="4" lg="4" class="my-1 pull-right">
                <b-form-group
                  label="Filter"
                  label-for="filter-input"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      id="filter-input"
                      v-model="filter"
                      type="search"
                      placeholder="Type to Search"
                    ></b-form-input>

                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''"
                        >Clear</b-button
                      >
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>

                <b-form-group
                  label="Per page"
                  label-for="per-page-select"
                  label-cols-sm="6"
                  label-cols-md="4"
                  label-cols-lg="3"
                  label-align-sm="right"
                  label-size="sm"
                  class="mb-0"
                >
                  <b-form-select
                    id="per-page-select"
                    class="page-number"
                    v-model="perPage"
                    :options="pageOptions"
                    size="sm"
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <!-- </b-row> -->

              <!-- Main table element -->
              <b-table
                :items="threads"
                :fields="fields"
                :busy="isBusy"
                sticky-header
                responsive
                no-border-collapse
                show-empty
                stacked="md"
                small
                @filtered="onFiltered"
                ref="forum-table"
              >
                <template #table-busy>
                  <div class="text-center text-default my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(title)="row">
                  <nuxt-link :to="'/forums/' + row.item.id">
                    {{ row.item.title }}
                  </nuxt-link>
                </template>

                <template #cell(status)="row">
                  <span v-if="row.item.status == 'active'">
                    <b-badge variant="success">active</b-badge>
                  </span>
                  <span v-else-if="row.item.status == 'closed'">
                    <b-badge variant="danger">closed</b-badge>
                  </span>
                  <span v-else-if="row.item.status == 'on_hold'">
                    <b-badge variant="warning">on hold</b-badge>
                  </span>
                  <span v-else-if="row.item.status == 'canceled'">
                    <b-badge variant="secondary">canceled</b-badge>
                  </span>
                </template>

                <template #row-details="row">
                  <b-card>
                    <ul>
                      <li v-for="(value, key) in row.item" :key="key">
                        {{ key }}: {{ value }}
                      </li>
                    </ul>
                  </b-card>
                </template>
              </b-table>
            </b-container>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { Modal } from "@/components";
import Fuse from "fuse.js";
import swal from "sweetalert2";
import { mapGetters } from "vuex";

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
      threads: "forum/threads",
      thread: "forum/thread",
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
      fuseSearch: null,
      isBusy: false,
      fields: [
        { key: "title", label: "topic", sortable: true },
        { key: "author_username", label: "author", sotrable: true },
        { key: "status", label: "status", sortable: true },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 15,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
    };
  },
  methods: {
    async fetchThreads() {
      this.isBusy = true;
      await this.$store.dispatch("forum/fetchThreads").then(() => {
        this.totalRows = this.threads.length;
        this.isBusy = false;
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    handleDelete(index, row) {
      swal({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-success btn-fill",
        cancelButtonClass: "btn btn-danger btn-fill",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.deleteRow(row);
          swal({
            title: "Deleted!",
            text: `You deleted ${row.name}`,
            type: "success",
            confirmButtonClass: "btn btn-success btn-fill",
            buttonsStyling: false,
          });
        }
      });
    },
  },
  watch: {
    isBusy(newVal, oldVal) {
      if (newVal !== oldVal) {
        const tableScrollBody = this.$refs["forum-table"].$el;
        if (newVal === true) {
          tableScrollBody.classList.add("overflow-hidden");
        } else {
          tableScrollBody.classList.remove("overflow-hidden");
        }
      }
    },
  },
  async mounted() {
    const tableScrollBody = this.$refs["forum-table"].$el;
    /* Consider debouncing the event call */
    tableScrollBody.addEventListener("scroll", this.onScroll);
    await this.fetchThreads();
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
.create-button {
  border-radius: 0px;
}
.rate-button {
  border-radius: 0px;
}
.ticket-button {
  border-radius: 0px;
}
.job-rate {
  border: 0px;
}
</style>
