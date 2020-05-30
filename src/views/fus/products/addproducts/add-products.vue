<template>
  <div style="padding: 10px;background: #f8f8f9">
    <Card title="添加商品" icon="ios-options" :padding="0" shadow style="width: 100%;">
      <div class="centerClass">
        <div class="filedClassDiv">
          <span class="spanclass">商品名称:</span>
          <Input ref="productName" v-model="productName" prefix="ios-paper-outline" placeholder="请输入商品名称" style="width: 20%" />
        </div>
        <div class="filedClassDiv">
          <span class="spanclass">商品类别:</span>
          <Select v-model="selectProductModel" style="width:20%">
            <Option
              v-for="item in productType"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <div class="filedClassDiv">
          <span class="spanclass">商品价格:</span>
          <Input ref="productPrice" v-model="productPrice" prefix="logo-yen" placeholder="请输入商品价格" style="width: 20%" />
        </div>
        <div class="filedClassDiv">
          <span class="spanclass">商品优惠价:</span>
          <Input ref="vipPrice" v-model="vipPrice" placeholder="请输入商品优惠价" prefix="logo-yen" style="width: 20%" />
        </div>
        <div class="filedClassDiv">
          <span class="spanclass">商品总库存:</span>
          <Input ref="totalInventory" v-model="totalInventory" placeholder="请输入商品总库存" prefix="ios-paper-outline" style="width: 20%" />
        </div>
        <div class="filedClassDiv">
          <span class="spanclass">商品图片:</span>
          <uploadImg @changeUploadsFile="changeUploadsFile" />
        </div>
        <div class="filedClassDiv">
          <span class="spanclass">商品详情图片:</span>
          <uploadImg @changeUploadsFile="changeUploadsFileDetail" />
        </div>
        <div class="filedClassDiv">
          <span class="spanclass">有无规格参数:</span>
          <RadioGroup v-model="hasSkus" @on-change="changeHasSkuStatus">
            <Radio label="无" />
            <Radio label="有" />
          </RadioGroup>
        </div>
        <div v-if="hasSkus == '有'" class="filedClassDiv">
          <span class="spanclass">添加商品规格:</span>
          <Button :size="buttonSize" icon="md-add-circle" type="dashed" @click="addSkuModel">添加规格</Button>
          <Tag
            v-for="item in skuNameArr"
            :key="item.name"
            style=" margin-left: 10px;"
            :color="item.randomColor"
            :name="item.name"
            closable
            @on-close="skuNameClose"
          >{{ item.name }}</Tag>
        </div>
        <div v-if="hasSkus == '有'" class="filedClassDiv">
          <span class="spanclass" />
          <skuTableModal
            :showtable="showSkuTableModal"
            :parent-table-data="skuTableData"
            :columns-default="skuTableTitleValueArr"
            @getSkuTableData="getSkuTableData"
            @editSkuTableData="editSkuTableData"
          />
        </div>
        <div class="filedClassDiv">
          <span class="spanclass">添加商品简介:</span>
          <Input
            ref="productDes"
            v-model="productDes"
            prefix="ios-paper-outline"
            style="width: 20%"
            type="textarea"
            :rows="4"
            placeholder="商品简介"
          />
        </div>
        <div class="filedClassDiv">
          <Button type="primary" long @click="addProducts">添加商品</Button>
        </div>
      </div>
    </Card>

    <!-- 添加商品规格 -->
    <addSkuModal :show="showAddSkuModel" @changeModal="changeAddskuModal" @getSkuType="getSkuType" />
  </div>
</template>

<script src="./addproducts.js"></script>

<style scoped>
.ivu-btn-long {
  /* margin-left: 115px; */
  width: 35%;
}
.filedClassDiv {
  margin-top: 20px;
}
.babyClass {
  background-color: white;
}
.centerClass {
  height: 70rem;
  margin-left: 10rem;
}
.spanclass {
  margin-right: 15px;
  font-family: auto;
  width: 100px;
  float: left;
}
.skuNameClass {
  margin-left: 10px;
}
</style>
