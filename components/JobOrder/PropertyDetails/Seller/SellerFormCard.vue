<template>
  <div class="content">
    <div class="row mt-5">
      <div class="col-12">
        <card>
          <h5 slot="header" class="title">Seller list</h5>
          <div class="col-xs-12">
            <b-btn class="btn btn-success" @click="addRow"> Add Seller </b-btn>
          </div>
          <card
            v-for="(item, index) in sellerLists"
            :key="index"
            title="Seller list"
          >
            <div class="col-md-12">
              <b-btn
                class="btn btn-danger btn-sm float-right"
                @click="deleteRow($event, index)"
              >
                <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
              </b-btn>
            </div>
            <div class="row justify-content-center mt-5">
              <div class="col-sm-5">
                <base-input label="Date lead added">
                  <el-date-picker
                    v-model="item.date_lead_added"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Choose date"
                  >
                  </el-date-picker>
                </base-input>
              </div>
              <div class="col-sm-5">
                <base-input label="Lead type">
                  <el-select
                    class="select-primary"
                    reqiured
                    size="large"
                    name="leadType"
                    placeholder="Lead type"
                    v-model="item.lead_type"
                  >
                    <el-option
                      v-for="option in leadTypeChoices.status"
                      class="select-primary"
                      :value="option.value"
                      :label="option.label"
                      :key="option.label"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
              <div class="col-sm-5">
                <base-input
                  label="Seller Lead name"
                  name="Seller Lead name"
                  placeholder="Seller lead name"
                  v-model="seller_lead_name"
                >
                </base-input>
              </div>
              <div class="col-sm-5">
                <base-input
                  label="Phone number"
                  name="Phone number"
                  placeholder="Phone number"
                  v-model="item.phone_number"
                >
                </base-input>
              </div>
              <div class="col-sm-5">
                <base-input
                  label="Email"
                  name="Email"
                  placeholder="Email"
                  v-model="item.email"
                >
                </base-input>
              </div>
              <div class="col-sm-5">
                <base-input label="Lead status">
                  <el-select
                    class="select-primary"
                    reqiured
                    size="large"
                    name="leadStatus"
                    placeholder="Lead status"
                    v-model="item.lead_status"
                  >
                    <el-option
                      v-for="option in leadStatusChoices.status"
                      class="select-primary"
                      :value="option.value"
                      :label="option.label"
                      :key="option.label"
                    >
                    </el-option>
                  </el-select>
                </base-input>
              </div>
              <div class="col-sm-5">
                <base-input
                  label="Seller Asking Price"
                  name="Seller Asking Price"
                  placeholder="Seller Asking Price"
                  v-model="item.seller_asking_price"
                >
                </base-input>
              </div>
              <!-- <div class="col-md-12">
                <div class="col-xs-12">
                  <b-btn class="btn btn-success" @click="addCounterOffer">
                    Add counter offer
                  </b-btn>
                </div>
                <card
                  v-for="(counter, index) in item.counter_offer_amount"
                  :key="index"
                  title="Counter Offer"
                >
                  <b-btn
                    class="btn btn-danger btn-sm float-right"
                    @click="deleteCounterOffer($event, index)"
                  >
                    <i class="tim-icons icon-simple-remove"></i>
                  </b-btn>
                  <div class="col-sm-5">
                    <base-input
                      label="Amount"
                      name="Amount"
                      placeholder="Amount"
                      v-model="counter.amount"
                    >
                    </base-input>
                  </div>
                </card>
              </div> -->
            </div>
          </card>
        </card>
      </div>
    </div>
  </div>
</template>
    <script>
import _ from "lodash";
import { Table, TableColumn, Select, Option } from "element-ui";
import { Modal } from "@/components";
import Fuse from "fuse.js";
import swal from "sweetalert2";
import { mapGetters, mapActions } from "vuex";
import SellerList from "@/mixins/SellerList.js";
import { DatePicker } from "element-ui";

export default {
  mixins: [SellerList],
  name: "SellerList",
  components: {
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [DatePicker.name]: DatePicker,
  },
  props: {
    propertyDetail: {
      Type: Object,
    },
    sellerLists: []
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    ...mapGetters({
      // sellerLists: "sellerList/sellerLists",
      sellerList: "sellerList/sellerList",
      pagination: "sellerList/sellerListsPagination",
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
    propertyFileCount() {
      if (this.sellerList) {
        return this.sellerList.length;
      }
    },
  },
  data() {
    return {
      searchQuery: "",
      searchedData: [],
      fuseSearch: null,
      isBusy: false,
      error: {
        property_detail: "",
        details: "",
        url: "",
        description: "",
        non_field_errors: "",
      },
      fields: [
        { key: "deate_lead_added", sortable: true },
        { key: "lead_type", sortable: true },
        { key: "seller_lead_name", sortable: true },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
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
        classic: false,
        create: false,
        comments: false,
        info: false,
      },
      sellerLists: [],
      property_detail_seller_lists: [],
      leadTypeChoices: {
        placeholder: "",
        status: [
          { value: null, label: "--Select lead type--" },
          { value: "buyers", label: "Buyers" },
          { value: "sellers", label: "Sellers" },
        ],
      },
      leadStatusChoices: {
        placeholder: "",
        status: [
          { value: "interested", label: "Interested" },
          { value: "not_interested", label: "Not Interested" },
          { value: "dead_leda", label: "Dead lead" },
          { value: "do_not_call_list", label: "Do Not Call List" },
        ],
      },
      modelValidations: {},
      counter_offer_amount: [],
    };
  },
  methods: {
    handleLike(index, row) {
      swal({
        title: `You liked ${row.name}`,
        buttonsStyling: false,
        type: "success",
        confirmButtonClass: "btn btn-success btn-fill",
      });
    },
    handleEdit(index, row) {
      swal({
        title: `You want to edit ${row.name}`,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info btn-fill",
      });
    },
    async deletePropertyDetail(id) {
      await this.$store.dispatch("propertyDetail/deletePropertyDetail", id);
    },

    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchPropertyFile(id) {
      let endpoint = `/api/v1/seller-list/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.propertyDetailFile = res.data;
        })
        .catch((e) => {
          throw e;
        });
    },
    // fetchSellerList() {
    //   this.isBusy = true;
    //   let endpoint = `/api/v1/seller-list/?search=${this.propertyDetail.id}`;
    //   return this.$axios
    //     .get(endpoint)
    //     .then((res) => {
    //       this.isBusy = false;
    //       this.sellerList = res.data.results;
    //     })
    //     .catch((e) => {
    //       this.isBusy = false;
    //       console.error(e);
    //     });
    // },
    // async fetchSellerList() {
    //   console.warn(this.pagination);
    //   this.isBusy = true;
    //   await this.$store
    //     .dispatch("sellerList/fetchSellerLists", this.pagination)
    //     .then(() => {
    //       console.warn("Seller list: ", this.sellerLists);
    //       this.isBusy = false;
    //     });
    // },
    refresh() {
      this.fetchSellerList();
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.details
          ? "Details: " + error.details
          : error.url
          ? "URL: " + errors.url
          : errors.description
          ? "Description" + error.description
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
    addRow: function () {
      this.sellerLists.push({
        date_lead_added: "",
        lead_type: null,
        seller_lead_name: "",
        phone_number: "",
        email: "",
        lead_status: null,
        seller_asking_price: "",
        counter_offer_amount: [],
      });
      console.log(this.sellerLists);
    },
    addCounterOffer() {
      const vm = this;
      // _.forEach(vm.sellerLists, function (item) {
      //   vm.counter_offer_amount.push({
      //     amount: "",
      //   });
      // });
      vm.counter_offer_amount.push({
        amount: "",
      });
      console.warn(vm.counter_offer_amount);
    },
    deleteCounterOffer(e, index) {
      const vm = this;
      vm.counter_offer_amount.splice(index, 1);
    },
    deleteRow(e, index) {
      this.sellerLists.splice(index, 1);
    },
  },
  mounted() {
    // this.fetchMe();
    // setTimeout(() => this.fetchSellerList(), 1000);
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
</style>
    