import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comments'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository =
            new InMemoryAnswerCommentsRepository()
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
    })
    it('Should fetch answer comments', async () => {
        await inMemoryAnswerCommentsRepository.create(
            makeAnswerComment({
                answerId: new UniqueEntityID('answer-01'),
            }),
        )
        await inMemoryAnswerCommentsRepository.create(
            makeAnswerComment({
                answerId: new UniqueEntityID('answer-01'),
            }),
        )
        await inMemoryAnswerCommentsRepository.create(
            makeAnswerComment({
                answerId: new UniqueEntityID('answer-01'),
            }),
        )
        const result = await sut.execute({
            answerId: 'answer-01',
            page: 1,
        })
        expect(result.value?.answerComments).toHaveLength(3)
    })
    it('Should fetch paginated answer comments', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswerCommentsRepository.create(
                makeAnswerComment({
                    answerId: new UniqueEntityID('answer-01'),
                }),
            )
        }
        const result = await sut.execute({
            answerId: 'answer-01',
            page: 2,
        })
        expect(result.value?.answerComments).toHaveLength(2)
    })
})
