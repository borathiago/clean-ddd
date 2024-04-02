import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository.js'
import { CommentOnAnswerUseCase } from './comment-on-answer.js'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository.js'
import { makeAnswer } from 'test/factories/make-answer.js'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository.js'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository,
        )
        inMemoryAnswerCommentsRepository =
            new InMemoryAnswerCommentsRepository()
        sut = new CommentOnAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryAnswerCommentsRepository,
        )
    })
    it('Should comment on some specific answer', async () => {
        const answer = makeAnswer()
        await inMemoryAnswersRepository.create(answer)
        await sut.execute({
            answerId: answer.id.toString(),
            authorId: answer.authorId.toString(),
            content: 'Comentário teste',
        })
        expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
            'Comentário teste',
        )
    })
})
