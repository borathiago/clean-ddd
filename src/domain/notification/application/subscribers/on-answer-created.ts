import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnsweredCreated implements EventHandler {
    constructor(
        private questionsRepository: QuestionsRepository,
        private sendNotification: SendNotificationUseCase,
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewAnswerNotification.bind(this), //eslint-disable-line
            AnswerCreatedEvent.name,
        )
    }

    public async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
        const question = await this.questionsRepository.findById(
            answer.questionId.toString(),
        )
        if (question) {
            await this.sendNotification.execute({
                recipientId: question.authorId.toString(),
                title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
                content: answer.excerpt,
            })
        }
        console.log(answer)
    }
}
