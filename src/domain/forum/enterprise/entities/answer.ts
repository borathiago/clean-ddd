import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerParams {
    content: string
    authorId: UniqueEntityID
    questionId: UniqueEntityID
    attachments: AnswerAttachmentList
    createdAt: Date
    updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerParams> {
    /* Com o parâmetro de tipagem, sta entidade Answer assume as propriedades no formato de AnswerParams */
    get content() {
        return this.params.content
    }

    get authorId() {
        return this.params.authorId
    }

    get questionId() {
        return this.params.questionId
    }

    get attachments() {
        return this.params.attachments
    }

    get createdAt() {
        return this.params.createdAt
    }

    get updatedAt() {
        return this.params.updatedAt
    }

    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat(' ‣')
    }

    private touch() {
        this.params.updatedAt = new Date()
    }

    set content(content: string) {
        this.params.content = content
        this.touch()
    }

    set attachments(attachments: AnswerAttachmentList) {
        this.params.attachments = attachments
        this.touch()
    }

    static create(
        params: Optional<AnswerParams, 'createdAt' | 'attachments'>,
        id?: UniqueEntityID,
    ) {
        const answer = new Answer(
            {
                ...params,
                attachments: params.attachments ?? new AnswerAttachmentList(),
                createdAt: params.createdAt ?? new Date(),
            },
            id,
        )
        const isNewAnswer = !id
        if (isNewAnswer) {
            answer.addDomainEvent(new AnswerCreatedEvent(answer))
        }
        return answer
    }
}
