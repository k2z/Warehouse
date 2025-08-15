import { ResourceStatusPipe } from './resource-status.pipe';

describe('ResourceStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new ResourceStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
