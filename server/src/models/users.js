import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: false,
    unique: 1,
  },

  avatarUrl: {
    type: String,
    default: "902e5693-e0bb-4097-8ab5-b81a71003fe4.jpg",
  },

  address: {
    type: String,
    required: false,
  },

  email: {
    type: String,
    required: true,
  },

  // ref라는 옵션에 참조할 모델(collection)명을 삽입.
  // 선한영향력가게 가맹점 스크랩
  scrapSunhan: [{ type: mongoose.Types.ObjectId, ref: "Sunhan" }],
  // 아동급식카드 가맹점 스크랩
  scrapChild: [{ type: mongoose.Types.ObjectId, ref: "Child" }],
  // 작성한 감사의 편지
  writeReviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  // 작성한 커뮤니티 게시글
  writePosts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],

  // 커뮤니티 게시글 신고
  blockPosts: [{ type: mongoose.Types.ObjectId }],
  // 감사의 편지 신고
  blockReviews: [{ type: mongoose.Types.ObjectId }],

  // 유저 신고
  blockUsers: [
    {
      _id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
      },
      nickname: {
        type: String,
        required: true,
      },
    },
  ],

  // 아동급식카드
  childCard: [
    {
      id: Number,
      // 잔액
      balance: Number,
    },
  ],

  kakaoId: Number,

  googleId: Number,

  naverId: String,
});

const User = mongoose.model("User", userSchema);

export default User;
