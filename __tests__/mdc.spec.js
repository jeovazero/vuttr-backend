const mdc = (a, b) => (a % b === 0 ? b : mdc(b, a % b))

describe('A mdc test', () => {
  it('mdc(90, 60) == 30', () => {
    expect(mdc(90, 60)).toBe(30)
  })
})
