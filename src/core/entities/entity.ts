import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class Entity<Params> {
    /* <Params> é um parâmetro de tipagem */
    private _id: UniqueEntityID
    protected params: Params
    get id() {
        return this._id
    }

    protected constructor(params: Params, id?: UniqueEntityID) {
        this._id = id ?? new UniqueEntityID()
        this.params = params
    }

    public equals(entity: Entity<unknown>) {
        if (entity === this) {
            return true
        }
        if (entity.id === this._id) {
            return true
        }
        return false
    }
}
