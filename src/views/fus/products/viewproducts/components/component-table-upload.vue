<template>
  <div>
    <div v-for="(item,index) in uploadList" :key="index" class="demo-upload-list">
      <template v-if="item.url !== ''">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.name)" />
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)" />
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info />
      </template>
    </div>
    <Upload
      v-if="uploadList.length == 0"
      ref="ViewUploads"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="5124"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      type="drag"
      action="/babyroom/file/uploadFile"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20" />
      </div>
    </Upload>
    <Modal v-model="visible" title="View Image">
      <img v-if="visible" :src="imgName" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: "ViewUploads",
  props: {
    imgs: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      defaultList: [],
      imgName: "",
      visible: false,
      uploadList: []
    };
  },
  watch: {
    imgs(val) {
      if (val !== undefined && val != "") {
        this.uploadList = [];
        this.uploadList.push({ name: val, url: val });
      }
    }
  },
  methods: {
    handleView(name) {
      var dateStr = this.$tools.formatDate(new Date(), "YY-MM-DD");
      if (name.indexOf("http") == 0) {
        this.imgName = name;
      } else {
        this.imgName =
          "http://babyroom.hecy.top/hecy/upload/image/compress/" +
          dateStr +
          "/" +
          name;
      }

      // this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      this.$emit("cancelUploadsFile", file.name);
      const fileList = this.uploadList;
      this.uploadList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file, fileList) {
      var dateStr = this.$tools.formatDate(new Date(), "YY-MM-DD");
      if (res.code === "0000") {
        var fileName = "compress_" + res.attachment + "-" + file.name;
        file.url =
          "http://babyroom.hecy.top/hecy/upload/image/compress/" +
          dateStr +
          "/" +
          fileName;
        file.name = fileName;
        console.log("fileName: " + fileName);
        this.$emit("addUploads", file.name);
      }
      this.uploadList = fileList;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式有误",
        desc:
          "文件名： " + file.name + " 类型不支持,请选择jpg或者png格式的文件."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超过大小限制",
        desc: "文件【" + file.name + "】超过了5M，太大了，压缩一下吧！"
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 1;
      if (!check) {
        this.$Notice.warning({
          title: "超过最大上传个数啦！"
        });
      }
      return check;
    }
  },
  mounted() {
    console.log("mounted: " + this.imgs);
    if (this.imgs !== undefined && this.imgs != "") {
      this.uploadList.push({ name: this.imgs, url: this.imgs });
    }
    // this.uploadList = this.$refs.ViewUploads.fileList;
  }
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
