import mongoose from "mongoose";

const sunhanSchema = new mongoose.Schema({
  // 가맹점명
  name: {
    type: String,
  },

  // 영업시간
  openingHours: {
    type: String,
  },

  // 주소
  address: {
    type: String,
  },

  // 제공대상
  tatget: {
    type: String,
  },

  // 제공품목
  offer: {
    type: String,
  },

  // 위도
  lat: {
    type: Number,
  },

  // 경도
  lng: {
    type: Number,
  },

  // 전화번호
  phoneNumber: {
    type: String,
  },

  // 이미지
  image: {
    type: String,
  },

  // 카테고리
  category: {
    type: String,
  },

  // 상세 카테고리
  detailCategory: {
    type: String,
  },
});

const Sunhan = mongoose.model("Sunhan", sunhanSchema);

export default Sunhan;
