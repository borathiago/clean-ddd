import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository.js'
import { DeleteQuestionCommentUseCase } from './delete-question-comments.js'
import { makeQuestionComment } from 'test/factories/make-question-comments.js'
import { UniqueEntityID } from '@/core/entities/unique-entity-id.js'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error.js'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        inMemoryQuestionCommentRepository =
            new InMemoryQuestionCommentsRepository()
        sut = new DeleteQuestionCommentUseCase(
            inMemoryQuestionCommentRepository,
        )
    })
    it('Should delete a question comment', async () => {
        const questionComment = makeQuestionComment()
        await inMemoryQuestionCommentRepository.create(questionComment)
        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        })
        expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
    })
    it('Should NOT delete question comment from another user', async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityID('autho-01'),
        })
        await inMemoryQuestionCommentRepository.create(questionComment)
        const result = await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'author-02',
        })
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
