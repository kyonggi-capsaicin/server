import mongoose from "mongoose";

export const parentCommentSchema = new mongoose.Schema({
  writer: {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    nickname: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
  },

  // 어떤 커뮤니티 게시글의 댓글인지
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  // 어떤 감사의 편지의 댓글인지
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },

  content: {
    type: String,
    required: true,
  },

  // 소속 대댓글 수
  commentCount: {
    type: Number,
    default: 0,
  },

  // 신고 수
  blockNumber: {
    type: Number,
    default: 0,
  },

  createAt: {
    type: String,
    required: true,
  },

  updateAt: {
    type: String,
    required: true,
  },
});

const ParentComment = mongoose.model("ParentComment", parentCommentSchema);

export default ParentComment;
