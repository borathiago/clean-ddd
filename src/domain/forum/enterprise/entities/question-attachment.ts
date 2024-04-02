import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentParams {
    questionId: UniqueEntityID
    attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentParams> {
    get questionId() {
        return this.params.questionId
    }

    get attachmentId() {
        return this.params.attachmentId
    }

    static create(params: QuestionAttachmentParams, id?: UniqueEntityID) {
        const questionAttachment = new QuestionAttachment(params, id)
        return questionAttachment
    }
}
