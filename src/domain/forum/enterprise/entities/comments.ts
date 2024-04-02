import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

export interface CommentParams {
    content: string
    authorId: UniqueEntityID
    createdAt: Date
    updatedAt?: Date
}

export abstract class Comment<
    Params extends CommentParams,
> extends Entity<Params> {
    get content() {
        return this.params.content
    }

    get authorId() {
        return this.params.authorId
    }

    get createdAt() {
        return this.params.createdAt
    }

    get updatedAt() {
        return this.params.updatedAt
    }

    private touch() {
        this.params.updatedAt = new Date()
    }

    set content(content: string) {
        this.params.content = content
        this.touch()
    }
}
