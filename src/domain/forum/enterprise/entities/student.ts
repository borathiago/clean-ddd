import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

interface StudentParams {
    name: string
}

export class Student extends Entity<StudentParams> {
    get name() {
        return this.params.name
    }

    static create(params: StudentParams, id?: UniqueEntityID) {
        const student = new Student(params, id)
        return student
    }
}
