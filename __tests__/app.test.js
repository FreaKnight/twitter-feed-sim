const app = require('../app');

describe('app.js', () => {
	// TODO: Remove this
	describe('jestTest', () => {
		test('Jest Works', () => {
			expect(true).toBeTruthy();
		});
	});

	describe('No arguments', () => {
		// beforeEach(() => {
		// 	process.argv = ['node', 'jest'];
		// });

		test('Should throw error', () => {
			expect(app.start).toThrow();
		});
	});
});