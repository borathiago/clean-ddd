import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Comment, CommentParams } from './comments'

export interface AnswerCommentParams extends CommentParams {
    answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentParams> {
    get answerId() {
        return this.params.answerId
    }

    static create(
        params: Optional<AnswerCommentParams, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const answerComment = new AnswerComment(
            {
                ...params,
                createdAt: params.createdAt ?? new Date(),
            },
            id,
        )
        return answerComment
    }
}
