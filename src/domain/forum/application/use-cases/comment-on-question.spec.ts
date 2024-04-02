import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository.js'
import { makeQuestion } from 'test/factories/make-question.js'
import { CommentOnQuestionUseCase } from './comment-on-questions.js'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository.js'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository.js'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepository,
        )
        inMemoryQuestionCommentRepository =
            new InMemoryQuestionCommentsRepository()
        sut = new CommentOnQuestionUseCase(
            inMemoryQuestionsRepository,
            inMemoryQuestionCommentRepository,
        )
    })
    it('Should comment on some specific question', async () => {
        const question = makeQuestion()
        await inMemoryQuestionsRepository.create(question)
        await sut.execute({
            questionId: question.id.toString(),
            authorId: question.authorId.toString(),
            content: 'Comentário teste',
        })
        expect(inMemoryQuestionCommentRepository.items[0].content).toEqual(
            'Comentário teste',
        )
    })
})
