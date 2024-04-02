import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Comment, CommentParams } from './comments'

export interface QuestionCommentParams extends CommentParams {
    questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentParams> {
    get questionId() {
        return this.params.questionId
    }

    static create(
        params: Optional<QuestionCommentParams, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const questionComment = new QuestionComment(
            {
                ...params,
                createdAt: params.createdAt ?? new Date(),
            },
            id,
        )
        return questionComment
    }
}
