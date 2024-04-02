import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

interface InstructorParams {
    name: string
}

export class Instructor extends Entity<InstructorParams> {
    get name() {
        return this.params.name
    }

    static create(params: InstructorParams, id?: UniqueEntityID) {
        const instructor = new Instructor(params, id)
        return instructor
    }
}
