import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AnswerAttachmentParams {
    answerId: UniqueEntityID
    attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentParams> {
    get answerId() {
        return this.params.answerId
    }

    get attachmentId() {
        return this.params.attachmentId
    }

    static create(params: AnswerAttachmentParams, id?: UniqueEntityID) {
        const answerAttachment = new AnswerAttachment(params, id)
        return answerAttachment
    }
}
