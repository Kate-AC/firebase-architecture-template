export interface StorableInterface<T> {
  toStorable(): T
}

export class User {
  readonly name: string
  readonly createdAt: Date

  constructor(props: Partial<User>) {
    this.name = props.name
    this.createdAt = props.createdAt
  }
}

export class UserEntity extends User implements StorableInterface<User> {
  readonly id: string

  constructor(props: Partial<UserEntity> & Partial<User>) {
    super(props)
    this.id = props.id
  }

  toStorable(): User {
    const { id, ...values } = this
    return Object.assign({}, new User(values))
  }
}
