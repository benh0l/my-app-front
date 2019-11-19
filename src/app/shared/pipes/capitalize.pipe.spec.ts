import { CapitalizePipe } from './capitalize.pipe';

describe('DisplayNamePipe', () => {
  it('create an instance', () => {
    const pipe = new CapitalizePipe();
    expect(pipe).toBeTruthy();
  });
});
