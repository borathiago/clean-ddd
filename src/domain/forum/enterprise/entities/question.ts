import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionParams {
    slug: Slug
    title: string
    content: string
    authorId: UniqueEntityID
    attachments: QuestionAttachmentList
    bestAnsweredId?: UniqueEntityID
    createdAt: Date
    updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionParams> {
    get slug() {
        return this.params.slug
    }

    get title() {
        return this.params.title
    }

    get content() {
        return this.params.content
    }

    get authorId() {
        return this.params.authorId
    }

    get attachments() {
        return this.params.attachments
    }

    get bestAnsweredId() {
        return this.params.bestAnsweredId
    }

    get createdAt() {
        return this.params.createdAt
    }

    get updatedAt() {
        return this.params.updatedAt
    }

    get isNew(): boolean {
        return dayjs().diff(this.createdAt, 'days') <= 3
    }

    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat(' ‣')
    }

    private touch() {
        this.params.updatedAt = new Date()
    }

    set title(title: string) {
        this.params.title = title
        this.params.slug = Slug.createFromText(title)
        this.touch()
    }

    set content(content: string) {
        this.params.content = content
        this.touch()
    }

    set attachments(attachments: QuestionAttachmentList) {
        this.params.attachments = attachments
        this.touch()
    }

    set bestAnsweredId(bestAnsweredId: UniqueEntityID | undefined) {
        if (bestAnsweredId === undefined) {
            return
        }
        if (
            bestAnsweredId === undefined ||
            !this.params.bestAnsweredId?.equals(bestAnsweredId)
        ) {
            this.addDomainEvent(
                new QuestionBestAnswerChosenEvent(this, bestAnsweredId),
            )
        }
        this.params.bestAnsweredId = bestAnsweredId
        this.touch()
    }

    static create(
        params: Optional<QuestionParams, 'createdAt' | 'slug' | 'attachments'>,
        id?: UniqueEntityID,
    ) {
        const question = new Question(
            {
                ...params,
                slug: params.slug ?? Slug.createFromText(params.title),
                attachments: params.attachments ?? new QuestionAttachmentList(),
                createdAt: params.createdAt ?? new Date(),
            },
            id,
        )
        return question
    }
}
