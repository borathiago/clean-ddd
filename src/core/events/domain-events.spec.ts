import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date
    // eslint-disable-next-line no-use-before-define
    private aggregate: CustomAggregate
    constructor(aggregate: CustomAggregate) {
        this.ocurredAt = new Date()
        this.aggregate = aggregate
    }

    public getAggregateId(): UniqueEntityID {
        return this.aggregate.id
    }
}

class CustomAggregate extends AggregateRoot<unknown> {
    static create() {
        const aggregate = new CustomAggregate(null)
        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
        return aggregate
    }
}

describe('Domain Events', () => {
    it('Should dispatch and listen for events', () => {
        const spy = vi.fn()
        DomainEvents.register(spy, CustomAggregateCreated.name)
        const aggregate = CustomAggregate.create()
        expect(aggregate.domainEvents).toHaveLength(1)
        DomainEvents.dispatchEventsForAggregate(aggregate.id)
        expect(spy).toHaveBeenCalled()
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})
