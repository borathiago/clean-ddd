import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
    AnswerComment,
    AnswerCommentParams,
} from '@/domain/forum/enterprise/entities/answer-comments'

export function makeAnswerComment(
    override: Partial<AnswerCommentParams> = {},
    id?: UniqueEntityID,
) {
    const answerComment = AnswerComment.create(
        {
            authorId: new UniqueEntityID(),
            answerId: new UniqueEntityID(),
            content: faker.lorem.text(),
            ...override,
        },
        id,
    )
    return answerComment
}
