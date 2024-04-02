import { Slug } from './slug'

test('Should create a new slug from given text', () => {
    const slug = Slug.createFromText('Example question title')
    expect(slug.value).toEqual('example-question-title')
})
