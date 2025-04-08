import { debugLog } from '../src/helpers/debug';

describe('debugLog', () => {
    const originalEnv = process.env.DEBUG;

    beforeEach(() => {
        process.env.DEBUG = "TRUE";
    });

    afterEach(() => {
        process.env.DEBUG = originalEnv; // Restore original environment variable
    });

    it('should log the message when DEBUG is TRUE', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        debugLog('INFO', 'Test message');
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[DEBUG] [INFO] Test message'));
        consoleSpy.mockRestore();
    });

    it('should not log the message when DEBUG is not TRUE', () => {
        process.env.DEBUG = "FALSE";
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        debugLog('INFO', 'Test message');
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
