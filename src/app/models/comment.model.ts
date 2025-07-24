export interface Comment {
  partitionKey: string;
  rowKey: string;
  name: string;
  message: string;
  submittedAt: Date;
  parentCommentId?: string; // For replies
  isReply: boolean;
}

export interface CommentResponse extends Comment {
  replies?: CommentResponse[];
}
