import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository.js'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer.js'
import { makeQuestion } from 'test/factories/make-question.js'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error.js'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository.js'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository.js'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepository,
        )
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository,
        )
        sut = new ChooseQuestionBestAnswerUseCase(
            inMemoryQuestionsRepository,
            inMemoryAnswersRepository,
        )
    })
    it('Should choose best answer for some specific question', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({
            questionId: question.id,
        })
        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)
        await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString(),
        })
        expect(inMemoryQuestionsRepository.items[0].bestAnsweredId).toEqual(
            answer.id,
        )
    })
    it('Should NOT choose best question answer from another user', async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityID('author-1'),
        })
        const answer = makeAnswer({
            questionId: question.id,
        })
        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)
        const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: 'author-2',
        })
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
