import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notifications'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
    })
    it('Should read a notification', async () => {
        const notification = makeNotification()
        await inMemoryNotificationsRepository.create(notification)
        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString(),
        })
        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
            expect.any(Date),
        )
    })
    it('Should NOT read a notification from another user', async () => {
        const notification = makeNotification({
            recipientId: new UniqueEntityID('recipient-01'),
        })
        await inMemoryNotificationsRepository.create(notification)
        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: 'recipient-02',
        })
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
