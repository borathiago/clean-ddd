import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'

export class OnQuestionBestAnswerChosen implements EventHandler {
    constructor(
        private answersRepository: AnswersRepository,
        private sendNotification: SendNotificationUseCase,
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendQuestionBestAnswerNotification.bind(this), //eslint-disable-line
            QuestionBestAnswerChosenEvent.name,
        )
    }

    public async sendQuestionBestAnswerNotification({
        question,
        bestAnsweredId,
    }: QuestionBestAnswerChosenEvent) {
        const answer = await this.answersRepository.findById(
            bestAnsweredId.toString(),
        )
        if (answer) {
            await this.sendNotification.execute({
                recipientId: answer.authorId.toString(),
                title: `Sua resposta foi escolhida!`,
                content: `A resposta que você enviou em "${question.title}" foi escolhida pelo autor como a melhor. Parabéns!`,
            })
        }
        console.log(answer)
    }
}
