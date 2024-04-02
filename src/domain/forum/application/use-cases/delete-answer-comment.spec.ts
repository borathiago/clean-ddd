import { UniqueEntityID } from '@/core/entities/unique-entity-id.js'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository.js'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment.js'
import { makeAnswerComment } from 'test/factories/make-answer-comments.js'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error.js'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository()
        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
    })
    it('Should delete an answer comment', async () => {
        const answerComment = makeAnswerComment()
        await inMemoryAnswerCommentRepository.create(answerComment)
        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })
        expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
    })
    it('Should NOT delete answer comment from another user', async () => {
        const answerComment = makeAnswerComment({
            authorId: new UniqueEntityID('autho-01'),
        })
        await inMemoryAnswerCommentRepository.create(answerComment)
        const result = await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: 'author-02',
        })
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
