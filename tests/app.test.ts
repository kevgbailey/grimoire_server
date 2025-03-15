import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
    it('should return a 200 status and a welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Welcome to the Express Web Server!');
    });
});

// Additional tests can be added here for other routes and controllers.