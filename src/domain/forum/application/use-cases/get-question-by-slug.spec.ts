import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepository,
        )
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })
    it('Should find a question', async () => {
        const newQuestion = makeQuestion({
            slug: Slug.create('example-question'),
        })
        inMemoryQuestionsRepository.create(newQuestion)
        const result = await sut.execute({
            slug: 'example-question',
        })
        expect(result.isRight()).toBe(true)
        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: newQuestion.title,
            }),
        })
        /* expect(inMemoryQuestionsRepository.items[0].title).toEqual(
            result.value?.question.title,
        ) */
    })
})
