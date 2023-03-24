<template>
  <div>
    <div class="row d-flex justify-content-center">
      <div class="col-md-10">
        <form @submit.prevent="save">
          <tabs
            type="primary"
            tabNavWrapperClasses="col-lg-3 col-md-6"
            tabContentClasses="col-md-8"
            vertical
            square
            class="row"
          >
            <tab-pane>
              <span slot="label"> Property Details </span>
              <first-step></first-step>
            </tab-pane>
            <tab-pane>
              <span slot="label"> Property Price </span>
              <card>
                <div
                  class="row justify-content-center mt-5"
                  v-for="(item, index) in this.property_price_statuses"
                  :key="index"
                >
                  <div class="col-sm-5 col-md-3">
                    <base-input
                      label="Asking price"
                      name="askingPrice"
                      v-model="item.asking_price"
                    >
                    </base-input>
                  </div>
                  <div class="col-sm-5 col-md-3">
                    <base-input
                      label="Cash terms"
                      name="cashTerms"
                      v-model="item.cash_terms"
                    >
                    </base-input>
                  </div>
                  <div class="col-sm-5 col-md-3 status">
                    <div class="row">
                      <label>Price status</label>
                    </div>
                    <el-select
                      class="select-primary"
                      size="large"
                      name="price_status"
                      v-model="item.price_status"
                    >
                      <el-option
                        v-for="option in priceStatusChoices.status"
                        class="select-primary"
                        :value="option.value"
                        :label="option.label"
                        :key="option.label"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-sm-12 col-md-12 mt-3">
                    <label>Finance Terms</label>
                    <textarea
                      name=""
                      id=""
                      cols="30"
                      rows="10"
                      class="form-control"
                      v-model="item.finance_terms"
                    ></textarea>
                  </div>
                  <div class="col-sm-12 col-md-12 mt-3">
                    <label>Other Terms</label>
                    <textarea
                      name=""
                      id=""
                      cols="30"
                      rows="10"
                      class="form-control"
                      v-model="item.other_terms"
                    ></textarea>
                  </div>
                  <div class="col-sm-12 mt-3">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      class="form-control"
                      type="text"
                      v-model="item.notes"
                    >
                    </textarea>
                  </div></div
              ></card>
            </tab-pane>
            <tab-pane>
              <span slot="label">Listing Ad Details</span>
              <third-step></third-step>
            </tab-pane>
            <tab-pane>
              <span slot="label"> Seller list </span>
              <card>
                <h5 slot="header" class="title">Seller list</h5>
                <div class="col-xs-12">
                  <b-btn class="btn btn-success" @click="addSellerRow">
                    Add Seller
                  </b-btn>
                </div>
                <card
                  v-for="(item, index) in this.property_detail_seller_lists"
                  :key="index"
                  title="Seller list"
                >
                  <div class="col-md-12">
                    <b-btn
                      class="btn btn-danger btn-sm float-right"
                      @click="deleteSellerRow($event, index)"
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
                        v-model="item.seller_lead_name"
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
                  </div>
                </card>
              </card>
            </tab-pane>
            <tab-pane>
              <span slot="label"> Buyer list </span>
              <card>
                <h5 slot="header" class="title">Buyer list</h5>
                <div class="col-xs-12">
                  <b-btn class="btn btn-success" @click="addBuyerRow">
                    Add Buyer
                  </b-btn>
                </div>
                <card
                  v-for="(item, index) in this.property_detail_buyer_lists"
                  :key="index"
                  title="Buyer list"
                >
                  <div class="col-md-12">
                    <b-btn
                      class="btn btn-danger btn-sm float-right"
                      @click="deleteBuyerRow($event, index)"
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
                        v-model="item.seller_lead_name"
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
                  </div>
                </card>
              </card>
            </tab-pane>
            <tab-pane>
              <span slot="label"> Acquisition list </span>
              <!-- <acquisition
                :acquisitions="property_detail_acquisition"
              ></acquisition> -->
              <card>
                <h5 slot="header" class="title">Acquisition list</h5>
                <div class="col-xs-12">
                  <b-btn class="btn btn-success" @click="addAcquisitionRow">
                    Add Acquisition
                  </b-btn>
                </div>
                <card
                  v-for="(item, index) in property_detail_acquisition"
                  :key="index"
                  title="Disposition list"
                >
                  <div class="col-md-12">
                    <b-btn
                      class="btn btn-danger btn-sm float-right"
                      @click="deleteDispositionRow($event, index)"
                    >
                      <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
                    </b-btn>
                  </div>
                  <div class="row justify-content-center mt-5">
                    <div class="col-sm-5">
                      <base-input
                        label="Possible offer"
                        v-model="item.possible_offer"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input
                        label="Approved amount from client"
                        v-model="item.approved_amount_from_client"
                      >
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          placeholder="Approved amount from Client"
                          v-model="item.approved_amount_from_client"
                        >
                          <el-option
                            v-for="option in possibleOfferChoices.status"
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
                        v-model="item.seller_lead_name"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input
                        label="Minimum amount"
                        name="Minimum amount"
                        v-model="item.minimum_amount"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input
                        label="Maximum amount"
                        name="Maximum amount"
                        v-model="item.maximum_amount"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input
                        label="Amount closed deal"
                        name="Amount closed deal"
                        v-model="item.amount_closed_deal"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input label="Deal status">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          placeholder="Deal status"
                          v-model="item.deal_status"
                        >
                          <el-option
                            v-for="option in dealStatusChoices.status"
                            class="select-primary"
                            :value="option.value"
                            :label="option.label"
                            :key="option.label"
                          >
                          </el-option>
                        </el-select>
                      </base-input>
                    </div>
                    <div class="col-sm-12">
                      <label>Notes</label>
                      <textarea
                        name="notes"
                        class="form-control"
                        type="text"
                        v-model="item.notes"
                      >
                      </textarea>
                    </div>
                  </div>
                </card>
              </card>
            </tab-pane>
            <tab-pane>
              <span slot="label"> Disposition list </span>
              <!-- <disposition-create
                v-model="property_detail_disposition"
                @change="changed"
              ></disposition-create> -->
              <card>
                <h5 slot="header" class="title">Disposition list</h5>
                <div class="col-xs-12">
                  <b-btn class="btn btn-success" @click="addDispositionRow">
                    Add Disposition
                  </b-btn>
                </div>
                <card
                  v-for="(item, index) in property_detail_disposition"
                  :key="index"
                  title="Acquisition list"
                >
                  <div class="col-md-12">
                    <b-btn
                      class="btn btn-danger btn-sm float-right"
                      @click="deleteAcquisitionRow($event, index)"
                    >
                      <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
                    </b-btn>
                  </div>
                  <div class="row justify-content-center mt-5">
                    <div class="col-sm-5">
                      <base-input
                        label="Selling price"
                        v-model="item.selling_price"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input
                        label="Discounted cash price"
                        v-model="item.discounted_cash_price"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input
                        label="Selling price minimum"
                        v-model="item.selling_price_minimum"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input
                        label="Seller price maximum"
                        name="Seller price maximum"
                        v-model="item.selling_price_maximum"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <label>Financed terms</label>
                      <textarea
                        name="notes"
                        class="form-control"
                        type="text"
                        v-model="item.financed_terms"
                      >
                      </textarea>
                    </div>
                    <div class="col-sm-5">
                      <base-input
                        label="Amount closed deal"
                        name="Amount closed deal"
                        v-model="item.amount_closed_deal"
                      >
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input label="Deal status">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          placeholder="Deal status"
                          v-model="item.deal_status"
                        >
                          <el-option
                            v-for="option in dealStatusChoices.status"
                            class="select-primary"
                            :value="option.value"
                            :label="option.label"
                            :key="option.label"
                          >
                          </el-option>
                        </el-select>
                      </base-input>
                    </div>
                    <div class="col-sm-12">
                      <label>Notes</label>
                      <textarea
                        name="notes"
                        class="form-control"
                        type="text"
                        v-model="item.notes"
                      >
                      </textarea>
                    </div>
                  </div>
                </card>
              </card>
            </tab-pane>
            <tab-pane>
              <span slot="label"> Assessment list </span>
              <!-- <disposition-create
                v-model="property_detail_disposition"
                @change="changed"
              ></disposition-create> -->
              <card>
                <h5 slot="header" class="title">Assessment list</h5>
                <div class="col-xs-12">
                  <b-btn class="btn btn-success" @click="addAssessmentRow">
                    Add Disposition
                  </b-btn>
                </div>
                <card
                  v-for="(item, index) in property_detail_assessment_files"
                  :key="index"
                  title="Acquisition list"
                >
                  <div class="col-md-12">
                    <b-btn
                      class="btn btn-danger btn-sm float-right"
                      @click="deleteAssessmentRow($event, index)"
                    >
                      <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
                    </b-btn>
                  </div>
                  <div class="row justify-content-center mt-5">
                    <div class="col-sm-12">
                      <label>Description</label>
                      <textarea
                        name="Description"
                        class="form-control"
                        type="text"
                        v-model="item.description"
                      >
                      </textarea>
                    </div>
                    <div class="col-sm-12">
                      <label>Notes</label>
                      <textarea
                        name="notes"
                        class="form-control"
                        type="text"
                        v-model="item.notes"
                      >
                      </textarea>
                    </div>
                    <div class="col-sm-12">
                      <label>Description of request</label>
                      <textarea
                        name="notes"
                        class="form-control"
                        type="text"
                        v-model="item.description_of_request"
                      >
                      </textarea>
                    </div>
                    <div class="col-sm-12">
                      <label>Completd Job order file</label>
                      <textarea
                        name="notes"
                        class="form-control"
                        type="text"
                        v-model="item.completed_job_order_file"
                      >
                      </textarea>
                    </div>
                    <div class="col-sm-5">
                      <base-input label="Date completed">
                        <el-date-picker
                          v-model="item.date_completed"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          placeholder="Choose date"
                        >
                        </el-date-picker>
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input label="Status of Job">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="leadType"
                          v-model="item.status_of_job"
                        >
                          <el-option
                            v-for="option in statusChoices.status"
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
                      <base-input label="Packets">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="leadType"
                          v-model="item.packets"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Comps by parcel">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="leadType"
                          v-model="item.comps_by_parcel"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Comps by area">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="leadType"
                          v-model="item.comps_by_area"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Due diligence">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="leadType"
                          v-model="item.due_diligence"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
                            class="select-primary"
                            :value="option.value"
                            :label="option.label"
                            :key="option.label"
                          >
                          </el-option>
                        </el-select>
                      </base-input>
                    </div>
                  </div>
                </card>
              </card>
            </tab-pane>
            <tab-pane>
              <span slot="label"> Marketing list </span>
              <!-- <disposition-create
                v-model="property_detail_disposition"
                @change="changed"
              ></disposition-create> -->
              <card>
                <h5 slot="header" class="title">Marketing list</h5>
                <div class="col-xs-12">
                  <b-btn class="btn btn-success" @click="addMarketingRow">
                    Add Marketing
                  </b-btn>
                </div>
                <card
                  v-for="(item, index) in property_detail_marketing_file"
                  :key="index"
                  title="Marketing list"
                >
                  <div class="col-md-12">
                    <b-btn
                      class="btn btn-danger btn-sm float-right"
                      @click="deleteMarketingRow($event, index)"
                    >
                      <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
                    </b-btn>
                  </div>
                  <div class="row justify-content-center mt-5">
                    <div class="col-sm-12">
                      <label>Description</label>
                      <textarea
                        name="Description"
                        class="form-control"
                        type="text"
                        v-model="item.description"
                      >
                      </textarea>
                    </div>
                    <div class="col-sm-12">
                      <label>Notes</label>
                      <textarea
                        name="notes"
                        class="form-control"
                        type="text"
                        v-model="item.notes"
                      >
                      </textarea>
                    </div>
                    <div class="col-sm-12">
                      <label>Description of request</label>
                      <textarea
                        name="notes"
                        class="form-control"
                        type="text"
                        v-model="item.description_of_request"
                      >
                      </textarea>
                    </div>
                    <div class="col-sm-12">
                      <label>Completd Job order file</label>
                      <textarea
                        name="notes"
                        class="form-control"
                        type="text"
                        v-model="item.completed_job_order_file"
                      >
                      </textarea>
                    </div>
                    <div class="col-sm-5">
                      <base-input label="Date completed">
                        <el-date-picker
                          v-model="item.date_completed"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          placeholder="Choose date"
                        >
                        </el-date-picker>
                      </base-input>
                    </div>
                    <div class="col-sm-5">
                      <base-input label="Status of Job">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="leadType"
                          v-model="item.status_of_job"
                        >
                          <el-option
                            v-for="option in statusChoices.status"
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
                      <base-input label="Images">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="images"
                          v-model="item.images"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Ad Content">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="ad_content"
                          v-model="item.ad_content"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Youtube videos">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="youtube_videos"
                          v-model="item.youtube_videos"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Tiktok videos">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="tiktok_videos"
                          v-model="item.tiktok_videos"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Email campaign">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="email_campaign"
                          v-model="item.email_campaign"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Other graphics">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="other_graphics"
                          v-model="item.other_graphics"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Other Marketing files">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="other_makerting_files"
                          v-model="item.other_makerting_files"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
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
                      <base-input label="Neighbor list">
                        <el-select
                          class="select-primary"
                          reqiured
                          size="large"
                          name="neighbor_list"
                          v-model="item.neighbor_list"
                        >
                          <el-option
                            v-for="option in yesOrNoOrNot.status"
                            class="select-primary"
                            :value="option.value"
                            :label="option.label"
                            :key="option.label"
                          >
                          </el-option>
                        </el-select>
                      </base-input>
                    </div>
                  </div>
                </card>
              </card>
            </tab-pane>
          </tabs>
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
              Save
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
              Saving...
            </base-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import FirstStep from "@/components/JobOrder/PropertyDetails/PropertyDetailFirstStep.vue";
import SecondStep from "@/components/JobOrder/PropertyDetails/PropertyDetailSecondStep.vue";
import ThirdStep from "@/components/JobOrder/PropertyDetails/PropertyDetailThirdStep.vue";
import SellerList from "~/components/JobOrder/PropertyDetails/Seller/SellerFormCard.vue";
import Acquisition from "~/components/JobOrder/PropertyDetails/Acquisition/AcquisitionCreate.vue";
import DispositionCreate from "~/components/JobOrder/PropertyDetails/Disposition/DispositionFormTable.vue";
import swal from "sweetalert2";
import { TabPane, Tabs, Collapse, CollapseItem } from "@/components";

import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";
import { Select, Option, DatePicker } from "element-ui";

export default {
  mixins: [CreatePropertyDetailMixin],
  name: "wizard-form",
  components: {
    FirstStep,
    SecondStep,
    ThirdStep,
    TabPane,
    Tabs,
    Collapse,
    CollapseItem,
    [Select.name]: Select,
    [Option.name]: Option,
    SellerList,
    [DatePicker.name]: DatePicker,
    Acquisition,
    DispositionCreate,
  },
  data() {
    return {
      property_price_statuses: [],
      wizardModel: {},
      loading: false,
      saving: false,
      clientUser: {},
      staffUser: {},
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "deactivate", label: "Deactivate" },
          { value: "active", label: "Active" },
        ],
      },
      error: {
        client: "",
        staff: "",
        apn: "",
        state: "",
        county: "",
        size: "",
        asking_price: "",
        cash_terms: "",
        finance_terms: "",
        other_terms: "",
        notes: "",
        non_field_errors: "",
      },
      property_detail_seller_lists: [],
      property_detail_buyer_lists: [],
      property_detail_acquisition: [],
      property_detail_disposition: [],
      property_detail_assessment_files: [],
      property_detail_marketing_file: [],
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
          { value: "dead_lead", label: "Dead lead" },
          { value: "do_not_call_list", label: "Do Not Call List" },
        ],
      },
      dealStatusChoices: {
        placeholder: "",
        status: [
          { value: "pending", label: "Pending" },
          { value: "sold", label: "Sold" },
          { value: "on_hold", label: "On hold" },
          { value: "on_going_negotiation", label: "On going negotiation" },
          { value: "drop_deal", label: "Drop deal" },
        ],
      },
      possibleOfferChoices: {
        placeholder: "",
        status: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
      statusChoices: {
        placeholder: "",
        status: [
          { value: "active", label: "Active" },
          { value: "closed", label: "Closed" },
          { value: "on_hold", label: "On hold" },
          { value: "canceled", label: "Canceled" },
        ],
      },
      yesOrNoOrNot: {
        placeholder: "",
        status: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "not_applicable", label: "Not applicable" },
        ],
      },
    };
  },
  provide() {
    return {
      $validator: this.$validator,
    };
  },
  methods: {
    ...mapActions("propertyDetail", ["savePropertyDetail", "reset"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateStep(ref) {
      return this.$refs[ref].validate();
    },
    addRow: function () {
      this.property_price_statuses.push({
        asking_price: "",
        cash_terms: "",
        finance_terms: "",
        other_terms: "",
        price_status: "",
        notes: "",
      });
    },
    deleteRow: function (e, item) {
      e.preventDefault();
      var index = this.property_price_statuses
        .map(function (item) {
          return item.id;
        })
        .indexOf(item);
      this.property_price_statuses.splice(index, 1);
    },
    onStepValidated(validated, model) {
      this.wizardModel = { ...this.wizardModel, ...model };
    },
    wizardComplete() {
      swal("Good job!", "You clicked the finish button!", "success");
    },
    async fetchClient(id) {
      let endpoint = `/api/v1/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchStaff(id) {
      let endpoint = `/api/v1/staff/${id}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
        });
      } catch (err) {
        console.error(err);
      }
    },
    async fetchMe() {
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            this.fetchClient(this.user.id);
          } else {
            this.fetchStaff(this.user.id);
          }
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.apn
          ? "APN: " + error.apn
          : error.state
          ? "State: " + error.state
          : error.county
          ? "County" + error.county
          : error.size
          ? "Size: " + error.size
          : error.property_status
          ? "Property status: " + error.property_status
          : error.asking_price
          ? "Asking price: " + error.asking_price
          : error.finance_terms
          ? "Finance terms: " + error.finance_terms
          : error.cash_terms
          ? "Cash terms: " + error.cash_terms
          : error.other_terms
          ? "Other terms: " + error.other_terms
          : error.notes
          ? "Notes: " + error.notes
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
    changed() {
      this.$emit("change", this.property_detail_disposition);
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        const clientPayload = {
          client: this.clientUser.client_code,
          client_email: this.$auth.user.email,
          property_status: this.property_status,
          company_name: this.company_name,
          phone: this.phone,
          email: this.email,
          website_url: this.website_url,
          file_storage: this.file_storage,
          apn: this.apn,
          county: this.county,
          state: this.state,
          size: this.size,
          property_owner: this.property_owner,
          property_complete_address: this.property_complete_address,
          notes_client_side: this.notes_client_side,
          notes_va_side: this.notes_va_side,
          notes_management_side: this.notes_management_side,
          property_price_statuses: this.property_price_statuses,
          property_detail_seller_lists: this.property_detail_seller_lists,
          property_detail_buyer_lists: this.property_detail_buyer_lists,
          property_detail_acquisition: this.property_detail_acquisition,
          property_detail_disposition: this.property_detail_disposition,
          property_detail_assessment_files:
            this.property_detail_assessment_files,
          property_detail_marketing_file: this.property_detail_marketing_file,
        };

        const staffPayload = {
          client: this.client,
          staff: [this.staffUser.id],
          staff_email: this.$auth.user.email,
          property_status: this.property_status,
          company_name: this.company_name,
          phone: this.phone,
          email: this.email,
          website_url: this.website_url,
          file_storage: this.file_storage,
          apn: this.apn,
          county: this.county,
          state: this.state,
          size: this.size,
          property_owner: this.property_owner,
          property_complete_address: this.property_complete_address,
          notes_client_side: this.notes_client_side,
          notes_va_side: this.notes_va_side,
          notes_management_side: this.notes_management_side,
          property_price_statuses: this.property_price_statuses,
          property_detail_seller_lists: this.property_detail_seller_lists,
          property_detail_buyer_lists: this.property_detail_buyer_lists,
          property_detail_acquisition: this.property_detail_acquisition,
          property_detail_disposition: this.property_detail_disposition,
          property_detail_assessment_files:
            this.property_detail_assessment_files,
          property_detail_marketing_file: this.property_detail_marketing_file,
        };

        if (this.$auth.user.designation_category == "staff") {
          try {
            this.saving = true;
            await this.savePropertyDetail(staffPayload)
              .then(() => {
                this.saving = false;
                this.$router.push("/job-order/property-detail");
                this.reset();
              })
              .catch((e) => {
                this.saving = false;
                this.error = e.response.data;
                this.errorMessage("danger", this.error);
              });
          } catch (e) {
            this.saving = false;
            this.error = e.response.data;
            this.errorMessage("danger", this.error);
          }
        } else {
          try {
            this.saving = true;
            await this.savePropertyDetail(clientPayload)
              .then(() => {
                this.saving = false;
                this.$router.push("/job-order/property-detail");
                this.reset();
              })
              .catch((e) => {
                this.saving = false;
                this.error = e.response.data;
                this.errorMessage("danger", this.error);
              });
          } catch (e) {
            this.saving = false;
            this.error = e.response.data;
            this.errorMessage("danger", this.error);
          }
        }
        this.loading = false;
      }
    },
    addSellerRow: function () {
      this.property_detail_seller_lists.push({
        apn: this.apn,
        client_code: this.clientUser.client_code,
        date_lead_added: "",
        lead_type: null,
        seller_lead_name: "",
        phone_number: "",
        email: "",
        lead_status: null,
        seller_asking_price: "",
        counter_offer_amount: [],
      });
      console.log(this.property_detail_seller_lists);
    },
    addBuyerRow: function () {
      this.property_detail_buyer_lists.push({
        apn: this.apn,
        client_code: this.clientUser.client_code,
        date_lead_added: "",
        lead_type: null,
        buyer_lead_name: "",
        phone_number: "",
        email: "",
        lead_status: null,
        seller_asking_price: "",
        total_minutes_consumed: "",
        counter_offer_amount: [],
      });
    },
    addAcquisitionRow: function () {
      this.property_detail_acquisition.push({
        apn: this.apn,
        client_code: this.clientUser.client_code,
        possible_offer: "",
        approved_amount_from_client: "",
        minimum_amount: "",
        maximum_amount: "",
        amount_closed_deal: "",
        deal_status: null,
        assigned_sales_team: null,
        notes: "",
      });
    },
    addDispositionRow() {
      this.property_detail_disposition.push({
        apn: this.apn,
        client_code: this.clientUser.client_code,
        selling_price: "",
        discounted_cash_price: "",
        selling_price_minimum: "",
        selling_price_maximum: "",
        financed_terms: "",
        amount_closed_deal: "",
        deal_status: "",
        assigned_sales_team: null,
        notes: "",
      });
    },
    addAssessmentRow: function () {
      this.property_detail_assessment_files.push({
        apn: this.apn,
        client_code: this.clientUser.client_code,
        description: "",
        description_of_request: "",
        completed_job_order_file: "",
        date_completed: "",
        status_of_job: "",
        packets: "",
        comps_by_parcel: "",
        comps_by_area: "",
        due_diligence: "",
        assigned_to: null,
        notes: "",
      });
    },
    addMarketingRow: function () {
      this.property_detail_marketing_file.push({
        apn: this.apn,
        client_code: this.clientUser.client_code,
        description: "",
        description_of_request: "",
        completed_job_order_file: "",
        date_completed: "",
        status_of_job: "",
        images: "",
        ad_content: "",
        youtube_videos: "",
        tiktok_videos: "",
        email_campaign: "",
        other_graphics: "",
        other_makerting_files: "",
        neighbor_list: "",
        assigned_to: null,
        notes: "",
      });
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
    deleteSellerRow(e, index) {
      this.property_detail_seller_lists.splice(index, 1);
    },
    deleteBuyerRow(e, index) {
      this.property_detail_buyer_lists.splice(index, 1);
    },
    deleteAcquisitionRow(e, index) {
      this.property_detail_disposition.splice(index, 1);
    },
    deleteAssessmentRow(e, index) {
      this.property_detail_assessment_files.splice(index, 1);
    },
    deleteMarketingRow(e, index) {
      this.property_detail_marketing_file.splice(index, 1);
    },
  },
  computed: {
    ...mapGetters("propertyDetail", [
      "price_status",
      "property_status",
      "category",
      "apn",
      "client",
      "county",
      "state",
      "size",
      "property_owner",
      "property_complete_address",
      "company_name",
      "phone",
      "email",
      "website_url",
      "file_storage",
      "notes_client_side",
      "notes_va_side",
      "notes_management_side",
      // "property_price_statuses"
    ]),
  },
  mounted() {
    this.fetchMe();
    this.addRow();
    // this.receivePropertyPriceStatuses();
  },
};
</script>
